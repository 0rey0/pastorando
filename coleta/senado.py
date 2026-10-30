"""Senadores do Ceará: API do Senado (https://legis.senado.leg.br/dadosabertos) e CEAPS (gastos)."""
import datetime
import re

from comum import (achar_coluna, classificar, fonte, foto_existente, get, homenagem, ler_csv, norm, numero_br,
                   resumir_gastos, salvar_foto)

BASE = "https://legis.senado.leg.br/dadosabertos"
MATERIA = "https://www25.senado.leg.br/web/atividade/materias/-/materia/%s"
TRECHO = re.compile(r"\b([A-Z]{3})\s*(?:/|-|–|x|para|>)\s*([A-Z]{3})\b")
CEAPS = ["https://www.senado.leg.br/transparencia/LAI/verba/despesa_ceaps_%d.csv",
         "https://www.senado.gov.br/transparencia/LAI/verba/despesa_ceaps_%d.csv"]


def _lista(x):
    if x is None:
        return []
    return x if isinstance(x, list) else [x]


def _andar(obj):
    """Percorre qualquer JSON e devolve todos os dicionários."""
    pilha = [obj]
    while pilha:
        o = pilha.pop()
        if isinstance(o, dict):
            yield o
            pilha.extend(o.values())
        elif isinstance(o, list):
            pilha.extend(o)


def _campo(d, *nomes):
    for n in nomes:
        for k, v in d.items():
            if k.lower() == n.lower() and v not in (None, ""):
                return v
    return None


def senadores():
    j = get(BASE + "/senador/lista/atual.json")
    out = []
    for p in _lista(j["ListaParlamentarEmExercicio"]["Parlamentares"]["Parlamentar"]):
        ip = p.get("IdentificacaoParlamentar", {})
        if ip.get("UfParlamentar") == "CE":
            out.append(ip)
    return out


def gastos_ceaps(ano):
    """Devolve {nome_normalizado: [itens]} a partir do CSV anual do CEAPS."""
    bruto = None
    for u in CEAPS:
        try:
            bruto = get(u % ano, tipo="bytes", aceitar="text/csv,*/*")
            break
        except Exception as e:  # noqa: BLE001
            print("  CEAPS indisponível em", u % ano, e)
    if bruto is None:
        return {}
    linhas = ler_csv(bruto)
    ini = next((i for i, l in enumerate(linhas) if any("senador" in norm(c) for c in l) and any("valor" in norm(c) for c in l)), None)
    if ini is None:
        return {}
    cab = linhas[ini]
    c_sen, c_mes = achar_coluna(cab, "senador"), achar_coluna(cab, "mes")
    c_tipo, c_forn = achar_coluna(cab, "tipo_despesa", "tipo despesa", "tipo"), achar_coluna(cab, "fornecedor")
    c_cnpj, c_val = achar_coluna(cab, "cnpj", "cpf"), achar_coluna(cab, "valor")
    c_det, c_data = achar_coluna(cab, "detalhamento"), achar_coluna(cab, "data")
    por = {}
    for l in linhas[ini + 1:]:
        if len(l) <= max(c_sen, c_val):
            continue
        por.setdefault(norm(l[c_sen]), []).append({
            "mes": int(numero_br(l[c_mes])) if c_mes is not None else 0,
            "categoria": (l[c_tipo] if c_tipo is not None else "Outros").strip().capitalize()[:80],
            "fornecedor": l[c_forn].strip() if c_forn is not None else "",
            "cnpj": l[c_cnpj].strip() if c_cnpj is not None else "",
            "valor": numero_br(l[c_val]), "url": "",
            "detalhe": l[c_det].strip()[:300] if c_det is not None and c_det < len(l) else "",
            "data": l[c_data].strip() if c_data is not None and c_data < len(l) else "",
        })
    return por


def viagens_ceaps(itens):
    """Acha trechos de voo (ex.: FOR/BSB) no detalhamento das passagens do CEAPS."""
    out = []
    for i in itens:
        if "passag" not in norm(i["categoria"]) and "locomoc" not in norm(i["categoria"]):
            continue
        m = TRECHO.findall((i.get("detalhe") or "").upper())
        if not m:
            continue
        d = i.get("data") or ""
        dm = re.match(r"(\d{2})/(\d{2})/(\d{4})", d)
        out.append({"data": "%s-%s-%s" % (dm.group(3), dm.group(2), dm.group(1)) if dm else d, "trecho": " · ".join("%s/%s" % x for x in m[:4]),
                    "valor": i["valor"], "empresa": i["fornecedor"].title(), "passageiro": "", "url": ""})
    out.sort(key=lambda v: v["data"], reverse=True)
    return out


def votacoes(cod, nome_id, ano):
    tentativas = [(BASE + "/senador/%s/votacoes.json" % cod, {"ano": ano}),
                  (BASE + "/votacao.json", {"codigoParlamentar": cod, "dataInicio": "%d-01-01" % ano, "dataFim": "%d-12-31" % ano})]
    for url, params in tentativas:
        try:
            j = get(url, params)
        except Exception as e:  # noqa: BLE001
            print("  votações do Senado indisponíveis em", url, e)
            continue
        out = []
        for d in _andar(j):
            voto = _campo(d, "SiglaDescricaoVoto", "DescricaoVoto", "siglaVotoParlamentar", "votoParlamentar")
            if not voto or not isinstance(voto, str):
                continue
            mat = d.get("Materia") or d.get("materia") or {}
            sess = d.get("SessaoPlenaria") or d.get("sessaoPlenaria") or {}
            titulo = _campo(mat, "DescricaoIdentificacao", "identificacao") or _campo(d, "DescricaoVotacao", "descricaoVotacao") or ""
            ementa = _campo(mat, "Ementa", "ementa") or _campo(d, "DescricaoVotacao", "descricaoVotacao") or ""
            data = str(_campo(sess, "DataSessao", "dataSessao") or _campo(d, "dataSessao", "DataSessao") or "")[:10]
            cod_v = _campo(d, "CodigoSessaoVotacao", "codigoSessaoVotacao", "codigoVotacao") or (titulo + data)
            cod_m = _campo(mat, "Codigo", "CodigoMateria", "codigoMateria") or _campo(d, "CodigoMateria", "codigoMateria")
            out.append({"id": "s%s" % cod_v, "casa": "senado", "data": data, "titulo": titulo, "descricao": ementa,
                        "temas": classificar(titulo + " " + ementa), "votos": {nome_id: voto},
                        "aprovada": None, "url": MATERIA % cod_m if cod_m else url, "dados": url + ("?ano=%s" % ano if "ano" in params else "")})
        if out:
            return out
    return []


def projetos(cod, ano):
    tentativas = [(BASE + "/senador/%s/autorias.json" % cod, {"ano": ano}),
                  (BASE + "/processo.json", {"codigoParlamentarAutor": cod, "ano": ano})]
    for url, params in tentativas:
        try:
            j = get(url, params)
        except Exception as e:  # noqa: BLE001
            print("  autorias do Senado indisponíveis em", url, e)
            continue
        out, vistos = [], set()
        for d in _andar(j):
            em = _campo(d, "EmentaMateria", "Ementa", "ementa")
            if not em or not isinstance(em, str):
                continue
            ident = _campo(d, "DescricaoIdentificacaoMateria", "DescricaoIdentificacao", "identificacao") or ""
            if ident in vistos:
                continue
            vistos.add(ident)
            cod_m = _campo(d, "CodigoMateria", "Codigo", "codigoMateria")
            hom = homenagem(em)
            out.append({"tipo": ident.split(" ")[0] if ident else "", "numero": ident, "ano": ano, "ementa": em,
                        "temas": classificar(em), "homenagem": hom,
                        "url": MATERIA % cod_m if cod_m else "https://www25.senado.leg.br/web/atividade/materias"})
        if out:
            return out
    return []


def coletar(ano=None):
    ano = ano or datetime.date.today().year
    sens = senadores()
    print("Senado: %d senadores do Ceará" % len(sens))
    ceaps = gastos_ceaps(ano)
    pessoas, vots = [], {}
    for s in sens:
        cod, nome = s.get("CodigoParlamentar"), s.get("NomeParlamentar")
        pid = "s%s" % cod
        pag = s.get("UrlPaginaParlamentar") or "https://www25.senado.leg.br/web/senadores/senador/-/perfil/%s" % cod
        p = {"id": pid, "casa": "senado", "nome": nome, "partido": s.get("SiglaPartidoParlamentar"),
             "email": s.get("EmailParlamentar"), "nome_civil": (s.get("NomeCompletoParlamentar") or "").title() or None,
             "telefone": None, "link": pag, "redes": [],
             "fontes": {"perfil": fonte("Senado Federal · página oficial", pag),
                        "partido": fonte("Senado · dados abertos (senadores em exercício)", BASE + "/senador/lista/atual.json"),
                        "gastos": fonte("Senado · CEAPS (cota dos senadores) %d" % ano, "https://www12.senado.leg.br/transparencia/sen/"),
                        "gastos_dados": fonte("Senado · planilha CEAPS %d" % ano, CEAPS[0] % ano),
                        "projetos": fonte("Senado · matérias de autoria", BASE + "/senador/%s/autorias.json" % cod),
                        "votos": fonte("Senado · votações do senador", BASE + "/senador/%s/votacoes.json?ano=%d" % (cod, ano))}}
        fot = None
        if s.get("UrlFotoParlamentar"):
            try:
                fot = salvar_foto(get(s["UrlFotoParlamentar"], tipo="bytes", aceitar="image/*"), pid)
            except Exception:  # noqa: BLE001
                fot = None
        p["foto"] = fot or foto_existente(pid)
        if p["foto"]:
            p["fontes"]["foto"] = fonte("Senado · foto oficial", s.get("UrlFotoParlamentar") or pag)
        chave = next((k for k in ceaps if norm(nome) in k or k in norm(s.get("NomeCompletoParlamentar") or nome)), None)
        if chave:
            p["gastos"] = resumir_gastos(ceaps[chave])
            via = viagens_ceaps(ceaps[chave])
            if via:
                p["viagens"] = {"n": len(via), "total": round(sum(v["valor"] for v in via), 2), "ultimas": via[:20]}
                p["fontes"]["viagens"] = fonte("Senado · CEAPS %d (detalhamento das passagens)" % ano, CEAPS[0] % ano)
        try:
            p["projetos"] = projetos(cod, ano)
        except Exception as e:  # noqa: BLE001
            print("  projetos falharam para", nome, e)
        for v in votacoes(cod, pid, ano):
            if v["id"] in vots:
                vots[v["id"]]["votos"].update(v["votos"])
            else:
                vots[v["id"]] = v
        pessoas.append(p)
    print("Senado: %d votações com votos do Ceará" % len(vots))
    return pessoas, list(vots.values())
