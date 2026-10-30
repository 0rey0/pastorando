"""Dados do TSE (https://dadosabertos.tse.jus.br): foto, partido, redes sociais, bens, votos por cidade,
financiamento de campanha, plano de governo e os eleitos de 2026.

Os arquivos do TSE são grandes. O robô baixa uma vez e guarda o resultado em site/dados/tse.json;
só refaz quando o arquivo tem mais de DIAS dias (ou com FORCAR_TSE=1).
"""
import csv
import io
import os
import re
import time
import zipfile

from comum import (FOTOS, agora, baixar, casar_nome, classificar, fonte, get, lado_povo, ler, norm, numero_br, salvar,
                   salvar_foto, slug)

CDN = "https://cdn.tse.jus.br/estatistica/sead/odsele"
ARQ = {
    "consulta": [CDN + "/consulta_cand/consulta_cand_{a}.zip"],
    "bens": [CDN + "/bem_candidato/bem_candidato_{a}.zip"],
    "redes": [CDN + "/consulta_cand/rede_social_candidato_{a}_CE.zip", CDN + "/consulta_cand/rede_social_candidato_{a}.zip"],
    "votos": [CDN + "/votacao_candidato_munzona/votacao_candidato_munzona_{a}.zip"],
    "receitas": [CDN + "/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_{a}.zip"],
    "proposta": [CDN + "/proposta_governo/proposta_governo_{a}_CE.zip", CDN + "/consulta_cand/proposta_governo_{a}_CE.zip"],
    "fotos": ["https://cdn.tse.jus.br/estatistica/sead/eleicoes/eleicoes{a}/fotos/foto_cand{a}_CE_div.zip"],
}
# palavras para achar o arquivo no catálogo do TSE caso o endereço direto mude
CATALOGO = {"consulta": ("candidatos-{a}", "consulta_cand_{a}.zip"), "bens": ("candidatos-{a}", "bem_candidato_{a}"),
            "redes": ("candidatos-{a}", "rede_social"), "proposta": ("candidatos-{a}", "proposta_governo_{a}_ce"),
            "fotos": ("candidatos-{a}", "foto_cand{a}_ce"), "votos": ("resultados-{a}", "votacao_candidato_munzona_{a}"),
            "receitas": ("prestacao-de-contas-eleitorais-{a}", "prestacao_de_contas_eleitorais_candidatos_{a}")}
PAGINA = {"candidatos": "https://dadosabertos.tse.jus.br/dataset/candidatos-{a}",
          "resultados": "https://dadosabertos.tse.jus.br/dataset/resultados-{a}",
          "contas": "https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-{a}"}
DIVULGA = "https://divulgacandcontas.tse.jus.br/divulga/#/home"
CARGOS = {"GOVERNADOR", "VICE-GOVERNADOR", "SENADOR", "1º SUPLENTE", "2º SUPLENTE", "1O SUPLENTE", "2O SUPLENTE",
          "DEPUTADO FEDERAL", "DEPUTADO ESTADUAL"}
CASA_DO_CARGO = {"deputado estadual": "alece", "deputado federal": "camara", "senador": "senado", "governador": "governo"}
DIAS = 15
SALARIO_MINIMO = {2018: 954, 2022: 1212, 2026: 1621}


def _cat(tipo, ano):
    pac, trecho = CATALOGO[tipo]
    try:
        j = get("https://dadosabertos.tse.jus.br/api/3/action/package_show", {"id": pac.format(a=ano)})
        for r in j.get("result", {}).get("resources", []):
            u = r.get("url") or ""
            if trecho.format(a=ano).lower() in u.lower():
                return u
    except Exception as e:  # noqa: BLE001
        print("  catálogo do TSE indisponível:", e)
    return None


def arquivo(tipo, ano):
    """Baixa o arquivo do TSE (ou reaproveita o do cache) e devolve o caminho local. None se não existir."""
    urls = [u.format(a=ano) for u in ARQ[tipo]]
    for u in urls:
        try:
            return baixar(u, "tse_%s_%d.zip" % (tipo, ano), dias=DIAS)
        except Exception as e:  # noqa: BLE001
            print("  TSE: %s %d indisponível em %s (%s)" % (tipo, ano, u, e))
    u = _cat(tipo, ano)
    if u and u not in urls:
        try:
            return baixar(u, "tse_%s_%d.zip" % (tipo, ano), dias=DIAS)
        except Exception as e:  # noqa: BLE001
            print("  TSE: %s %d também falhou pelo catálogo (%s)" % (tipo, ano, e))
    return None


def _membros(caminho, regex):
    with zipfile.ZipFile(caminho) as z:
        return [n for n in z.namelist() if re.search(regex, n, flags=re.I)]


def tabela(caminho, regex, filtro=None):
    """Lê em fluxo os CSVs do zip cujo nome casa com 'regex'. filtro(texto_da_linha) descarta linhas cedo."""
    for nome in _membros(caminho, regex):
        with zipfile.ZipFile(caminho) as z:
            with z.open(nome) as f:
                amostra = f.read(20000)
            cod = "latin-1"
            try:
                amostra.decode("utf-8")
                cod = "utf-8-sig"
            except UnicodeDecodeError:
                pass
            with z.open(nome) as f:
                texto = io.TextIOWrapper(f, encoding=cod, errors="replace", newline="")
                primeira = texto.readline()
                sep = ";" if primeira.count(";") >= primeira.count(",") else ","
                cab = [c.strip().upper() for c in next(csv.reader([primeira], delimiter=sep))]
                for linha in texto:
                    if filtro and not filtro(linha):
                        continue
                    for l in csv.reader([linha], delimiter=sep):
                        yield dict(zip(cab, l))


def _v(d, *nomes):
    for n in nomes:
        v = d.get(n)
        if v not in (None, "", "#NULO#", "#NULO", "-1", "-3", "-4", "#NE#", "#NE"):
            return v.strip()
    return ""


def eleito(sit):
    s = norm(sit)
    return s.startswith("eleito")


def candidatos(ano):
    c = arquivo("consulta", ano)
    if not c:
        return {}
    out = {}
    for d in tabela(c, r"consulta_cand_%d_CE\.(csv|txt)$" % ano):
        if _v(d, "SG_UF") not in ("CE", "") or _v(d, "DS_CARGO").upper() not in CARGOS:
            continue
        sq = _v(d, "SQ_CANDIDATO")
        if not sq:
            continue
        turno = int(numero_br(_v(d, "NR_TURNO") or 1))
        if sq in out and out[sq]["turno"] > turno:
            continue
        out[sq] = {
            "sq": sq, "ano": ano, "turno": turno, "cargo": _v(d, "DS_CARGO").title().replace("º", "º"),
            "nome": _v(d, "NM_CANDIDATO").title(), "urna": _v(d, "NM_URNA_CANDIDATO").title(), "numero": _v(d, "NR_CANDIDATO"),
            "partido": _v(d, "SG_PARTIDO"), "federacao": _v(d, "NM_FEDERACAO", "SG_FEDERACAO"), "situacao": _v(d, "DS_SIT_TOT_TURNO").capitalize(),
            "cpf": re.sub(r"\D", "", _v(d, "NR_CPF_CANDIDATO")), "email": _v(d, "DS_EMAIL", "NM_EMAIL").lower(),
            "ocupacao": _v(d, "DS_OCUPACAO").capitalize(), "instrucao": _v(d, "DS_GRAU_INSTRUCAO").capitalize(),
            "genero": _v(d, "DS_GENERO").capitalize(), "cor_raca": _v(d, "DS_COR_RACA").capitalize(),
            "nascimento": _v(d, "DT_NASCIMENTO"), "cidade_natal": _v(d, "NM_MUNICIPIO_NASCIMENTO").title(),
            "candidatura": _v(d, "DS_SITUACAO_CANDIDATURA", "DS_DETALHE_SITUACAO_CAND").capitalize(),
        }
    print("  TSE %d: %d candidaturas no Ceará" % (ano, len(out)))
    return out


def redes(ano, sqs):
    c = arquivo("redes", ano)
    if not c:
        return {}
    out = {}
    for d in tabela(c, r"rede_social_candidato_%d_CE\.(csv|txt)$" % ano):
        sq = _v(d, "SQ_CANDIDATO")
        if sq in sqs:
            u = _v(d, "DS_URL")
            if u and u not in out.setdefault(sq, []):
                out[sq].append(u if u.startswith("http") else "https://" + u.lstrip("/"))
    return out


def bens(ano, sqs):
    c = arquivo("bens", ano)
    if not c:
        return {}
    out = {}
    for d in tabela(c, r"bem_candidato_%d_CE\.(csv|txt)$" % ano):
        sq = _v(d, "SQ_CANDIDATO")
        if sq not in sqs:
            continue
        b = out.setdefault(sq, {"total": 0.0, "itens": []})
        v = numero_br(_v(d, "VR_BEM_CANDIDATO"))
        b["total"] = round(b["total"] + v, 2)
        b["itens"].append([_v(d, "DS_TIPO_BEM_CANDIDATO").capitalize(), _v(d, "DS_BEM_CANDIDATO")[:140].capitalize(), v])
    for b in out.values():
        b["itens"].sort(key=lambda x: -x[2])
        b["n"] = len(b["itens"])
        b["itens"] = b["itens"][:20]
    return out


def votos(ano, sqs):
    c = arquivo("votos", ano)
    if not c:
        return {}
    por = {}
    for d in tabela(c, r"votacao_candidato_munzona_%d_CE\.(csv|txt)$" % ano):
        sq = _v(d, "SQ_CANDIDATO")
        if sq not in sqs:
            continue
        t = int(numero_br(_v(d, "NR_TURNO") or 1))
        q = int(numero_br(_v(d, "QT_VOTOS_NOMINAIS_VALIDOS", "QT_VOTOS_NOMINAIS", "QT_VOTOS")))
        m = _v(d, "NM_MUNICIPIO").title()
        x = por.setdefault(sq, {}).setdefault(t, {})
        x[m] = x.get(m, 0) + q
    out = {}
    for sq, turnos in por.items():
        t = max(turnos)
        mun = sorted(turnos[t].items(), key=lambda kv: -kv[1])
        total = sum(v for _, v in mun)
        out[sq] = {"turno": t, "total": total, "n_municipios": sum(1 for _, v in mun if v > 0),
                   "municipios": [[m, v] for m, v in mun[:15]],
                   "fortaleza_pct": round(100 * turnos[t].get("Fortaleza", 0) / total, 1) if total else None,
                   "primeiro_turno": sum(turnos.get(1, {}).values()) if t > 1 else None}
    return out


def receitas(ano, sqs):
    """Financiamento de campanha: quanto veio de doações pequenas, de grandes doadores, do bolso do candidato e do fundo público."""
    c = arquivo("receitas", ano)
    if not c:
        return {}
    sm = SALARIO_MINIMO.get(ano, 1500)
    bruto = {}
    for d in tabela(c, r"receitas_candidatos_%d_CE\.(csv|txt)$" % ano):
        sq = _v(d, "SQ_CANDIDATO")
        if sq not in sqs:
            continue
        v = numero_br(_v(d, "VR_RECEITA"))
        origem, fonte_ = norm(_v(d, "DS_ORIGEM_RECEITA")), norm(_v(d, "DS_FONTE_RECEITA"))
        r = bruto.setdefault(sq, {"total": 0.0, "proprios": 0.0, "publico": 0.0, "outros": 0.0, "pf": {}})
        r["total"] += v
        if "propri" in origem:
            r["proprios"] += v
        elif "fundo especial" in fonte_ or "fundo partid" in fonte_ or "fefc" in fonte_:
            r["publico"] += v
        elif "pessoas fisicas" in origem or "financiamento coletivo" in origem or "internet" in origem:
            doador = _v(d, "NR_CPF_CNPJ_DOADOR") or _v(d, "NM_DOADOR") or "?"
            p = r["pf"].setdefault(doador, [_v(d, "NM_DOADOR_RFB", "NM_DOADOR").title(), 0.0])
            p[1] += v
        else:
            r["outros"] += v
    out = {}
    for sq, r in bruto.items():
        peq = sum(v for _, v in r["pf"].values() if v <= sm)
        med = sum(v for _, v in r["pf"].values() if sm < v <= 10 * sm)
        gra = sum(v for _, v in r["pf"].values() if v > 10 * sm)
        grandes = sorted([x for x in r["pf"].values() if x[1] > 10 * sm], key=lambda x: -x[1])[:5]
        out[sq] = {"total": round(r["total"], 2), "pequenas": round(peq, 2), "medias": round(med, 2), "grandes": round(gra, 2),
                   "proprios": round(r["proprios"], 2), "publico": round(r["publico"], 2), "outros": round(r["outros"], 2),
                   "n_doadores": len(r["pf"]), "maiores": [[n, round(v, 2)] for n, v in grandes], "limite_pequena": sm}
    return out


def fotos(ano, pedidos):
    """pedidos: {sq: pid}. Grava site/fotos/{pid}.jpg e devolve {pid: caminho}."""
    c = arquivo("fotos", ano)
    if not c or not pedidos:
        return {}
    out = {}
    with zipfile.ZipFile(c) as z:
        for n in z.namelist():
            m = re.search(r"(\d{5,})", os.path.basename(n))
            if m and m.group(1) in pedidos:
                pid = pedidos[m.group(1)]
                f = salvar_foto(z.read(n), pid)
                if f:
                    out[pid] = f
    return out


VERBOS = r"(criar|ampliar|implantar|implementar|construir|garantir|expandir|reformar|contratar|universalizar|fortalecer|instalar|zerar|reduzir|aumentar|duplicar|entregar|valorizar|investir|levar|requalificar|estruturar|assegurar|realizar|promover|instituir|estender|interiorizar|modernizar|recuperar|conceder|privatizar|vender|terceirizar|transferir|desestatizar)"


def promessas_do_plano(texto, limite=45):
    """Separa, do plano de governo, as frases que são compromisso concreto (verbo de ação; números contam a favor)."""
    linhas = []
    for l in (texto or "").replace("\r", "").split("\n"):
        l = re.sub(r"[ \t\u00a0]+", " ", l).strip()
        if not l:
            linhas.append("")
            continue
        m = re.match(r"^(?:[^\w(\"“]+|\d{1,2}[.)]\s+|[a-z][.)]\s+)", l)
        marcador = bool(m)
        if m:
            l = l[m.end():].strip()
        # junta a linha quebrada no meio da frase
        if linhas and linhas[-1] and not marcador and not re.search(r"[.;:!?]$", linhas[-1]) and l[:1].islower():
            linhas[-1] += " " + l
        else:
            linhas.append(l)
    pedacos = []
    for l in linhas:
        pedacos += re.split(r"(?<=[.;!?])\s+(?=[A-ZÀ-Ú])", l)
    achadas, vistas = [], set()
    for p in pedacos:
        p = p.strip(" ;.-–")
        if not (45 <= len(p) <= 300):
            continue
        n = norm(p)
        if not re.match(r"^(\w+\s){0,3}" + VERBOS, n):
            continue
        chave = n[:60]
        if chave in vistas:
            continue
        vistas.add(chave)
        lado, palavra = lado_povo(p)
        achadas.append({"texto": p[0].upper() + p[1:] + ".", "temas": classificar(p), "lado": lado, "concreta": bool(re.search(r"\d", p))})
    achadas.sort(key=lambda x: (not x["concreta"], x["lado"] != 1))
    return achadas[:limite]


def plano(ano, sq, pid):
    c = arquivo("proposta", ano)
    if not c:
        return None
    nomes = [n for n in zipfile.ZipFile(c).namelist() if sq in n and n.lower().endswith(".pdf")]
    if not nomes:
        return None
    bruto = zipfile.ZipFile(c).read(nomes[0])
    pasta = os.path.join(os.path.dirname(FOTOS), "planos")
    os.makedirs(pasta, exist_ok=True)
    arq = "%s-%d.pdf" % (pid, ano)
    with open(os.path.join(pasta, arq), "wb") as f:
        f.write(bruto)
    texto = ""
    try:
        from pypdf import PdfReader
        texto = "\n".join((pg.extract_text() or "") for pg in PdfReader(io.BytesIO(bruto)).pages)
    except Exception as e:  # noqa: BLE001
        print("  não consegui ler o texto do plano de governo:", e)
    return {"ano": ano, "pdf": "planos/" + arq, "paginas": texto.count("\f") or None, "promessas": promessas_do_plano(texto),
            "fonte": fonte("TSE · Propostas de governo %d (Ceará)" % ano, PAGINA["candidatos"].format(a=ano))}


# ---------------------------------------------------------------- ligação com quem está no mandato

def _escolher(p, cands, cargos):
    pool = [c for c in cands.values() if norm(c["cargo"]) in cargos]
    cpf = re.sub(r"\D", "", p.get("cpf") or "")
    if cpf:
        for c in pool:
            if c["cpf"] and c["cpf"] == cpf:
                return c
    # primeiro os eleitos, depois suplentes, depois qualquer um
    for grupo in ([c for c in pool if eleito(c["situacao"])], [c for c in pool if "suplente" in norm(c["situacao"])], pool):
        c, nota = casar_nome(p["nome"], grupo, chave=lambda c: [c["urna"], c["nome"]], minimo=0.67)
        if c:
            return c
    return None


def _resumo_candidatura(c):
    return {k: c[k] for k in ("ano", "cargo", "urna", "numero", "partido", "situacao", "sq")}


def completar_alece(pessoas, c22):
    """Põe na lista os deputados estaduais eleitos em 2022 que não aparecem na Verba de Desempenho (licenciados, secretários)
    ou todos os 46, se o Portal da ALECE estiver fora do ar."""
    alece = [p for p in pessoas if p["casa"] == "alece"]
    adicionados = []
    for c in sorted(c22.values(), key=lambda c: c["urna"]):
        if norm(c["cargo"]) != "deputado estadual" or not eleito(c["situacao"]):
            continue
        if casar_nome(c["urna"], alece, chave=lambda p: p["nome"], minimo=0.67)[0] or casar_nome(c["nome"], alece, chave=lambda p: p["nome"], minimo=0.67)[0]:
            continue
        novo = {"id": "a-" + slug(c["urna"]), "casa": "alece", "nome": c["urna"], "partido": None, "foto": None, "email": None, "redes": [],
                "link": "https://www.al.ce.gov.br/deputados", "fora_exercicio": bool(alece),
                "fontes": {"perfil": fonte("Assembleia Legislativa do Ceará · deputados", "https://www.al.ce.gov.br/deputados")}}
        pessoas.append(novo)
        adicionados.append(dict(novo))
    if adicionados:
        print("  TSE: %d eleitos de 2022 para a ALECE sem verba no período" % len(adicionados))
    return adicionados


def _readicionar(pessoas, pacote):
    tem = {p["id"] for p in pessoas}
    for a in pacote.get("adicionados") or []:
        if a["id"] not in tem:
            pessoas.append(dict(a))


def coletar(pessoas, forcar=False):
    """Enriquece 'pessoas' (lista de parlamentares) com dados do TSE e devolve o pacote eleitoral para o site."""
    velho = ler("tse.json", {}) or {}
    ids = sorted(p["id"] for p in pessoas)
    if not forcar and not os.environ.get("FORCAR_TSE") and velho.get("ids") == ids and velho.get("epoch", 0) > time.time() - DIAS * 86400:
        print("TSE: usando dados guardados de", velho.get("quando"))
        _readicionar(pessoas, velho)
        return velho
    c18, c22, c26 = candidatos(2018), candidatos(2022), candidatos(2026)
    if not (c22 or c26):
        raise RuntimeError("arquivos de candidatos do TSE indisponíveis")
    adicionados = completar_alece(pessoas, c22)
    por_pid, alvo = {}, {2018: {}, 2022: {}, 2026: {}}

    def marca(ano, sq, pid):
        alvo[ano].setdefault(sq, set()).add(pid)

    todos26 = {"deputado estadual", "deputado federal", "senador", "governador", "vice-governador", "1º suplente", "2º suplente"}
    for p in pessoas:
        casa = p["casa"]
        cargos = {"alece": {"deputado estadual"}, "camara": {"deputado federal"},
                  "senado": {"senador", "1º suplente", "2º suplente", "1o suplente", "2o suplente"}}[casa]
        c = _escolher(p, c22, cargos) or (casa == "senado" and _escolher(p, c18, cargos)) or None
        info = {}
        if c:
            info["mandato"] = _resumo_candidatura(c)
            marca(c["ano"], c["sq"], p["id"])
            if c.get("cpf"):
                p.setdefault("cpf", c["cpf"])
            for k in ("ocupacao", "instrucao", "genero", "cor_raca", "nascimento", "cidade_natal"):
                if c.get(k):
                    info[k] = c[k]
            if c.get("email"):
                info["email_campanha"] = c["email"]
        if c26:
            c2 = _escolher(dict(p, cpf=(c or {}).get("cpf") or p.get("cpf")), c26, todos26)
            mesmo = c2 and ((c and c.get("cpf") and c2.get("cpf") == c["cpf"]) or casar_nome(c2["urna"], [p["nome"]] + ([c["urna"]] if c else []), minimo=0.85)[0])
            info["em2026"] = _resumo_candidatura(c2) if mesmo else None
            if mesmo:
                marca(2026, c2["sq"], p["id"])
        por_pid[p["id"]] = info
    eleitos26 = [c for c in c26.values() if eleito(c["situacao"]) and norm(c["cargo"]) in CASA_DO_CARGO]
    gov22 = [c for c in c22.values() if norm(c["cargo"]) == "governador" and eleito(c["situacao"])]
    for c in eleitos26:
        marca(2026, c["sq"], "e26-" + c["sq"])
    for c in gov22:
        marca(2022, c["sq"], "gov-" + c["sq"])
    extra = {}
    for ano in (2018, 2022, 2026):
        sqs = set(alvo[ano])
        if not sqs:
            continue
        r, b, v, rc = redes(ano, sqs), bens(ano, sqs), votos(ano, sqs), receitas(ano, sqs)
        # foto: a de 2022/2018 para quem está no mandato; a de 2026 só para os novos eleitos
        pedidos = {}
        for sq, pids in alvo[ano].items():
            for pid in pids:
                if ano != 2026 or pid.startswith("e26-"):
                    pedidos[sq] = pid
        fs = fotos(ano, pedidos)
        for sq, pids in alvo[ano].items():
            for pid in pids:
                e = extra.setdefault(pid, {})
                if ano == 2026 and not pid.startswith("e26-"):
                    e["candidatura2026"] = {k: x for k, x in (("votos", v.get(sq)), ("redes", r.get(sq)), ("bens", b.get(sq)), ("receitas", rc.get(sq))) if x}
                    continue
                if r.get(sq):
                    e["redes"] = r[sq]
                if b.get(sq):
                    e["bens"] = dict(b[sq], ano=ano)
                if v.get(sq):
                    e["votos"] = dict(v[sq], ano=ano)
                if rc.get(sq):
                    e["receitas"] = dict(rc[sq], ano=ano)
                if fs.get(pid):
                    e["foto_tse"] = fs[pid]
    for pid, info in por_pid.items():
        info.update(extra.get(pid, {}))
    # governadores: atual (2022) e eleito em 2026, com plano de governo
    governo = {}
    for chave, lst, ano in (("atual", gov22, 2022), ("eleito2026", [c for c in eleitos26 if norm(c["cargo"]) == "governador"], 2026)):
        if not lst:
            continue
        c = lst[0]
        pid = "gov-" + c["sq"] if ano == 2022 else "e26-" + c["sq"]
        g = dict(_resumo_candidatura(c), id=pid, nome=c["urna"], nome_civil=c["nome"], ocupacao=c["ocupacao"])
        g.update(extra.get(pid, {}))
        try:
            g["plano"] = plano(ano, c["sq"], pid)
        except Exception as e:  # noqa: BLE001
            print("  plano de governo falhou:", e)
        vice = next((x for x in (c22 if ano == 2022 else c26).values() if norm(x["cargo"]) == "vice-governador" and x["numero"] == c["numero"]), None)
        if vice:
            g["vice"] = vice["urna"]
        governo[chave] = g
    lista26 = []
    for c in sorted(eleitos26, key=lambda c: (c["cargo"], c["urna"])):
        pid = "e26-" + c["sq"]
        atual = next((q for q in alvo[2026].get(c["sq"], ()) if not q.startswith("e26-")), None)
        x = dict(_resumo_candidatura(c), id=pid, nome=c["urna"], casa=CASA_DO_CARGO[norm(c["cargo"])], atual=atual)
        x.update({k: v for k, v in extra.get(pid, {}).items() if k in ("redes", "votos", "bens", "foto_tse", "receitas")})
        lista26.append(x)
    pacote = {"quando": agora(), "epoch": int(time.time()), "ids": ids, "adicionados": adicionados, "pessoas": por_pid, "eleitos2026": lista26, "governo": governo,
              "fontes": {str(a): {"candidatos": PAGINA["candidatos"].format(a=a), "resultados": PAGINA["resultados"].format(a=a),
                                  "contas": PAGINA["contas"].format(a=a)} for a in (2018, 2022, 2026)},
              "divulga": DIVULGA}
    salvar("tse.json", pacote)
    print("TSE: %d parlamentares ligados à candidatura; %d eleitos em 2026" % (sum(1 for i in por_pid.values() if i.get("mandato")), len(lista26)))
    return pacote


def aplicar(pessoas, pacote):
    """Copia para cada parlamentar o que veio do TSE (foto só quando a Casa não publica)."""
    fontes = pacote.get("fontes", {})
    for p in pessoas:
        info = (pacote.get("pessoas") or {}).get(p["id"])
        if not info:
            continue
        ano = str((info.get("mandato") or {}).get("ano") or 2022)
        f = fontes.get(ano, {})
        if info.get("mandato"):
            p["nome_urna"] = info["mandato"]["urna"]
        p["tse"] = {k: info[k] for k in ("mandato", "em2026", "ocupacao", "instrucao", "genero", "cor_raca", "nascimento", "cidade_natal", "candidatura2026") if k in info}
        if info.get("redes"):
            p["redes"] = sorted(set((p.get("redes") or []) + info["redes"]), key=lambda u: u.lower())
            p.setdefault("fontes", {})["redes"] = fonte("TSE · redes sociais declaradas na candidatura de %s" % ano, f.get("candidatos"))
        for k, fk in (("bens", "candidatos"), ("votos", "resultados"), ("receitas", "contas")):
            if info.get(k):
                p[k] = info[k]
                p.setdefault("fontes", {})[k] = fonte("TSE · %s %s" % ({"bens": "bens declarados", "votos": "votação por município", "receitas": "prestação de contas da campanha"}[k], ano), f.get(fk))
        if info.get("foto_tse") and not p.get("foto"):
            p["foto"] = info["foto_tse"]
            p.setdefault("fontes", {})["foto"] = fonte("TSE · foto da candidatura de %s" % ano, f.get("candidatos"))
        if not p.get("partido") and info.get("mandato"):
            p["partido"] = info["mandato"]["partido"]
            p["partido_eleicao"] = True
            p.setdefault("fontes", {})["partido"] = fonte("TSE · partido pelo qual foi eleito(a) em %s" % ano, f.get("candidatos"))
        if not p.get("email") and info.get("email_campanha"):
            p["email_campanha"] = info["email_campanha"]
    return pessoas


def slug_pid(nome):
    return slug(nome)
