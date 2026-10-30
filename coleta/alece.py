"""Deputados estaduais: Verba de Desempenho Parlamentar no Portal da Transparência da ALECE.

Fonte: https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar (CSV por mês).
O formato das colunas não é documentado; o robô procura as colunas pelo nome.
"""
import datetime
import html as htmllib
import io
import re

from comum import (DIAG, achar_coluna, casar_nome, classificar, config, fonte, get, homenagem, ler, ler_csv, norm, numero_br,
                   resumir_gastos, salvar, slug)

URL = "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar/csv"
PAG_VOT = "https://transparencia.al.ce.gov.br/consultas-gerais/votacao-nominal"
SITE = "https://transparencia.al.ce.gov.br"
TETO_MENSAL = 36184.18  # Resolução 762/2023 e Ato Normativo 340/2023 (valor-base por gabinete)
TRAMIT = "https://www2.al.ce.gov.br/legislativo/tramit%d/%s%d_%02d.pdf"
TIPOS = {"pl": "PL", "pi": "Indicação", "plc": "PLC", "pec": "PEC"}
PREFIXOS_MENSAGEM = ["msg", "mens", "men", "m", "ms", "mg"]  # palpites para o endereço das mensagens do governador
VDP_PAG = "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar"


def nome_limpo(n):
    n = re.sub(r"^\s*(dep(utad[oa])?\.?)\s+", "", str(n), flags=re.I).strip()
    return " ".join(p.capitalize() if len(p) > 2 else p.lower() for p in n.split())


def mes(ano, m):
    bruto = get(URL, {"mes": m, "ano": ano}, tipo="bytes", aceitar="text/csv,*/*")
    linhas = ler_csv(bruto)
    ini = next((i for i, l in enumerate(linhas[:30]) if any("valor" in norm(c) for c in l)), None)
    if ini is None:
        return []
    cab = linhas[ini]
    c_nome = achar_coluna(cab, "parlamentar", "deputad", "nome")
    c_val = achar_coluna(cab, "valor pago", "valor liquido", "valor")
    c_forn = achar_coluna(cab, "fornecedor", "credor", "favorecido", "razao social", "empresa")
    c_cnpj = achar_coluna(cab, "cnpj", "cpf")
    c_cat = achar_coluna(cab, "item", "natureza", "elemento", "tipo", "despesa", "descricao", "historico")
    if c_nome is None or c_val is None:
        print("  ALECE %02d/%d: não achei colunas de nome e valor em %s" % (m, ano, cab))
        return []
    itens = []
    for l in linhas[ini + 1:]:
        if len(l) <= max(c_nome, c_val) or not l[c_nome].strip():
            continue
        itens.append({
            "deputado": nome_limpo(l[c_nome]), "mes": m,
            "categoria": (l[c_cat].strip().capitalize()[:80] if c_cat is not None and c_cat < len(l) else "Verba de desempenho"),
            "fornecedor": l[c_forn].strip() if c_forn is not None and c_forn < len(l) else "",
            "cnpj": l[c_cnpj].strip() if c_cnpj is not None and c_cnpj < len(l) else "",
            "valor": numero_br(l[c_val]), "url": "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar?mes=%d&ano=%d" % (m, ano),
        })
    return itens


def _casar(nome, ids):
    """Liga o nome da planilha de votação ao id do deputado (nomes podem vir com ou sem 'Dep.')."""
    n = norm(nome_limpo(nome))
    if n in ids:
        return ids[n]
    for k, v in ids.items():
        if n and (n in k or k in n):
            return v
    return None


def votacoes(ids, maximo=80):
    """Votações nominais: a página lista uma planilha (XLSX) por matéria."""
    try:
        import openpyxl
    except ImportError:
        print("  openpyxl não instalado; votações da ALECE puladas")
        return []
    pag = get(PAG_VOT, tipo="bytes", aceitar="text/html").decode("utf-8", "ignore")
    out = []
    for linha in re.findall(r"<tr[^>]*>(.*?)</tr>", pag, flags=re.S | re.I)[: maximo * 2]:
        lk = re.search(r'href="([^"]+\.xlsx)"', linha, flags=re.I)
        if not lk:
            continue
        texto = htmllib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", linha))).strip()
        dt = re.search(r"(\d{2})/(\d{2})/(\d{4})", texto)
        url = lk.group(1) if lk.group(1).startswith("http") else SITE + lk.group(1)
        try:
            wb = openpyxl.load_workbook(io.BytesIO(get(url, tipo="bytes", aceitar="*/*")), read_only=True, data_only=True)
        except Exception as e:  # noqa: BLE001
            print("  planilha falhou", url, e)
            continue
        votos = {}
        for ws in wb.worksheets:
            c_nome = c_voto = None
            for row in ws.iter_rows(values_only=True):
                cel = ["" if c is None else str(c) for c in row]
                if c_voto is None:
                    c_voto = achar_coluna(cel, "voto")
                    c_nome = achar_coluna(cel, "deputad", "parlamentar", "nome")
                    continue
                if c_nome is None or max(c_nome, c_voto) >= len(cel):
                    continue
                pid = _casar(cel[c_nome], ids)
                if pid and cel[c_voto].strip():
                    votos[pid] = cel[c_voto].strip().capitalize()
        if votos:
            celulas = [htmllib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", c))).strip() for c in re.findall(r"<td[^>]*>(.*?)</td>", linha, flags=re.S | re.I)]
            celulas = [c for c in celulas if c and not re.fullmatch(r"(\d{1,2}ª|\d{2}/\d{2}/\d{4}|baixar|download|xlsx|planilha|csv)", c, flags=re.I)]
            materia = (max(celulas, key=len) if celulas else re.sub(r"(?i)\b(baixar|download)\b", "", texto)).strip()[:200]
            texto = materia
            out.append({"id": "a" + slug(url)[-40:], "casa": "alece", "data": "%s-%s-%s" % (dt.group(3), dt.group(2), dt.group(1)) if dt else "",
                        "titulo": materia, "descricao": texto[:400], "temas": classificar(texto), "votos": votos, "url": url})
        if len(out) >= maximo:
            break
    return out


def _texto_pdf(bruto):
    try:
        from pypdf import PdfReader
    except ImportError:
        return ""
    try:
        r = PdfReader(io.BytesIO(bruto))
        return "\n".join((pg.extract_text() or "") for pg in r.pages[:2])
    except Exception:  # noqa: BLE001
        return ""


VERBOS_EMENTA = (r"Disp[õo]e|Institui|Altera|Cria|Denomina|Declara|Concede|Autoriza|Estabelece|Pro[íi]be|Obriga|Assegura|Garante|Reconhece|"
                 r"Acrescenta|Revoga|Torna|Inclui|Regulamenta|Determina|Considera|Modifica|Disciplina|Fixa|Inscreve|Indica|Sugere|Solicita|Requer|Prorroga|Ratifica|Aprova")
PARSER = 3  # suba este número quando o leitor de PDF mudar: os PDFs que não deram certo são lidos de novo


def _limpa_autor(a):
    a = re.sub(r"^\s*\d+\s*[-–]\s*", "", a)  # "99058 - Deputado Fulano" -> "Deputado Fulano"
    a = re.sub(r"\s+", " ", a).strip(" .;:-")
    return a.title() if a.isupper() else a


def ler_proposicao(texto):
    """Do PDF de tramitação: autor, ementa e data. Aceita mais de um modelo de PDF."""
    t = re.sub(r"[ \t]+", " ", texto or "")
    if len(t.strip()) < 30:
        return None
    autor = re.search(r"Autor(?:ia|\(a\)|es)?\s*:\s*(.+)", t, flags=re.I)  # "Autor: 100096 - DEPUTADO SIMAO PEDRO"
    autor = autor.group(1) if autor else None
    if not autor:
        m = re.search(r"((?:Deputad[oa]|Dep\.)\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^\n,;]{2,60})", t)
        if m:
            autor = m.group(1)
        elif re.search(r"Poder Executivo|Governador(?:a)? do Estado|Mensagem n", t, flags=re.I):
            autor = "Poder Executivo"
    ementa = re.search(r"Ementa\s*:\s*(.+?)(?:\n\s*\n|EXMO|Excelent|Senhor Presidente|Sala das|A ASSEMBLEIA|$)", t, flags=re.S | re.I)
    em = ementa.group(1) if ementa else None
    if not em:  # modelo do sistema de assinatura da ALECE: "Descrição: DISPÕE SOBRE ..."
        d = re.search(r"Descri[çc][ãa]o\s*:\s*(.+)", t, flags=re.I)
        if d:
            em = re.sub(r"^(?:PROJETO DE (?:LEI|INDICA[ÇC][ÃA]O)(?: COMPLEMENTAR)?|INDICA[ÇC][ÃA]O|PROPOSTA DE EMENDA [^Q]*?)\s+QUE\s+", "", d.group(1).strip(), flags=re.I)
    if not em or len(em.strip()) < 12 or em.strip()[:1] in "“\"'":
        m = re.search(r"((?:%s)\b.{10,600}?(?:providências|\.\s*\n|\.\s+(?=[A-ZÁÉÍÓÚ])))" % VERBOS_EMENTA, t, flags=re.S)
        em = m.group(1) if m else em
    data = re.search(r"(?:Data de autua[cç][aã]o|Data de apresenta[cç][aã]o|Data da cria[cç][aã]o|Data)\s*:?\s*(\d{2})/(\d{2})/(\d{4})", t, flags=re.I)
    if not autor or not em:
        return None
    em = re.sub(r"\s+", " ", em).strip().strip("“”\"").strip()
    em = re.sub(r"\?([^?]{2,80})\?", r"“\1”", em)  # aspas que viraram "?" no PDF
    if len(em) < 12:
        return None
    return {"autor": _limpa_autor(autor), "ementa": em[:1].upper() + em[1:].lower() if em.isupper() else em,
            "data": "%s-%s-%s" % (data.group(3), data.group(2), data.group(1)) if data else ""}


def _existe(url):
    try:
        return get(url, tipo="bytes", aceitar="application/pdf", tentativas=1, timeout=30)[:4] == b"%PDF"
    except Exception:  # noqa: BLE001
        return False


def proposicoes(ano, max_baixar=400, falhas_seguidas=20):
    """Varre os PDFs de tramitação (pl1_26.pdf, pl2_26.pdf...) e guarda o que já leu em dados/alece_proposicoes.json.
    Os PDFs que existem mas não deram para ler ficam anotados em '_sem_texto' e são lidos de novo quando o leitor melhora."""
    banco = ler("alece_proposicoes.json", {}) or {}
    doano = banco.setdefault(str(ano), {})
    sem = doano.setdefault("_sem_texto", {})
    # as mensagens do governador têm outro prefixo no endereço; descobre qual é uma vez e guarda
    pref = doano.setdefault("_prefixo", {})
    if "mensagem" not in pref and pref.get("mensagem_tentou", 0) < 3:
        pref["mensagem_tentou"] = pref.get("mensagem_tentou", 0) + 1
        for cand in PREFIXOS_MENSAGEM:
            if any(_existe(TRAMIT % (ano, cand, k, ano % 100)) for k in (1, 2, 3, 5, 8)):
                pref["mensagem"] = cand
                break
        DIAG["alece_prefixo_mensagem"] = pref.get("mensagem")
    if pref.get("mensagem"):
        TIPOS[pref["mensagem"]] = "Mensagem"
    for tipo in TIPOS:
        ja = doano.setdefault(tipo, {})
        ruins = sem.setdefault(tipo, {})
        # números que faltam: os nunca vistos e os que falharam com um leitor antigo
        conhecidos = [int(k) for k in ja] + [int(k) for k in ruins]
        topo = max(conhecidos or [0])
        refazer = [n for n in range(1, topo + 1) if (str(n) not in ja and ruins.get(str(n), 0) < PARSER) or
                   (str(n) in ja and ja[str(n)].get("v", 1) < PARSER)]
        fila, n, falhas, baixados, novas = list(refazer), topo + 1, 0, 0, 0
        while baixados < max_baixar:
            if fila:
                k = fila.pop(0)
            elif falhas < falhas_seguidas:
                k, n = n, n + 1
            else:
                break
            url = TRAMIT % (ano, tipo, k, ano % 100)
            try:
                bruto = get(url, tipo="bytes", aceitar="application/pdf", tentativas=2)
            except Exception:  # noqa: BLE001
                if k >= topo:
                    falhas += 1
                continue
            baixados += 1
            if k >= topo:
                falhas = 0
            info = ler_proposicao(_texto_pdf(bruto))
            if info:
                info["url"] = url
                info["v"] = PARSER
                ja[str(k)] = info
                ruins.pop(str(k), None)
                novas += 1
            else:
                ruins[str(k)] = PARSER
                am = DIAG.setdefault("alece_pdf_sem_texto", [])
                if len(am) < 4:
                    am.append({"url": url, "bytes": len(bruto), "inicio": bruto[:8].decode("latin-1"), "texto": _texto_pdf(bruto)[:700]})
        print("  ALECE %s %d: %d lidos, %d sem texto, %d novos nesta rodada" % (tipo, ano, len(ja), len(ruins), novas))
    salvar("alece_proposicoes.json", banco)
    return {k: v for k, v in doano.items() if not k.startswith("_")}


def projetos_por_autor(doano, pessoas, ano):
    """Liga cada proposição ao(s) deputado(s) autor(es). Devolve {pid: [projetos]} e a lista do Poder Executivo."""
    por, executivo = {p["id"]: [] for p in pessoas}, []
    for tipo, itens in doano.items():
        if tipo.startswith("_"):
            continue
        rotulo = "Mensagem" if TIPOS.get(tipo) == "Mensagem" else None
        for n, info in itens.items():
            em = info["ementa"]
            hom = homenagem(em)
            pr = {"tipo": rotulo or TIPOS.get(tipo, tipo.upper()), "numero": "%s/%d" % (n, ano), "ano": ano, "ementa": em, "data": info.get("data"),
                  "temas": classificar(em), "homenagem": hom, "url": info["url"]}
            autor = norm(_limpa_autor(info["autor"]))
            if rotulo or "executivo" in autor or "governador" in autor:
                executivo.append(pr)
                continue
            partes = re.split(r",| e |;|/", re.sub(r"^(deputad[oa]s?|dep\.?)\s+", "", autor))
            for parte in partes:
                alvo, nota = casar_nome(parte, pessoas, chave=lambda p: [p["nome"]] + ([p["nome_urna"]] if p.get("nome_urna") else []), minimo=0.67)
                if alvo:
                    por[alvo["id"]].append(pr)
    for v in por.values():
        v.sort(key=lambda x: (x.get("data") or "", x["numero"]), reverse=True)
    executivo.sort(key=lambda x: (x.get("data") or "", x["numero"]), reverse=True)
    return por, executivo


def coletar(ano=None):
    hoje = datetime.date.today()
    ano = ano or hoje.year
    por = {}
    for m in range(1, (hoje.month if ano == hoje.year else 12) + 1):
        try:
            for it in mes(ano, m):
                por.setdefault(it.pop("deputado"), []).append(it)
        except Exception as e:  # noqa: BLE001
            print("  ALECE %02d/%d falhou: %s" % (m, ano, e))
    pessoas = []
    for nome, itens in sorted(por.items()):
        g = resumir_gastos(itens)
        g["teto_periodo"] = round(TETO_MENSAL * max(1, len(g["meses"])), 2)
        g["pct_teto"] = round(100 * g["total"] / g["teto_periodo"], 1) if g["teto_periodo"] else None
        ultimo = max(g["meses"]) if g["meses"] else hoje.month
        pessoas.append({"id": "a-" + slug(nome), "casa": "alece", "nome": nome, "partido": None, "foto": None, "email": None,
                        "link": "https://www.al.ce.gov.br/deputados", "gastos": g, "redes": [],
                        "fontes": {"perfil": fonte("Assembleia Legislativa do Ceará · deputados", "https://www.al.ce.gov.br/deputados"),
                                   "gastos": fonte("ALECE · Portal da Transparência (Verba de Desempenho Parlamentar)", VDP_PAG + "?mes=%d&ano=%d" % (ultimo, ano)),
                                   "gastos_dados": fonte("ALECE · CSV da Verba de Desempenho (%02d/%d)" % (ultimo, ano), URL + "?mes=%d&ano=%d" % (ultimo, ano)),
                                   "teto": fonte("ALECE · Resolução 762/2023 (valor da verba)", "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar"),
                                   "votos": fonte("ALECE · votações nominais", PAG_VOT),
                                   "projetos": fonte("ALECE · proposições em tramitação (PDF de cada uma)", "https://www.al.ce.gov.br/legislativo")}})
    print("ALECE: %d deputados com Verba de Desempenho em %d" % (len(pessoas), ano))
    vots = []
    try:
        vots = votacoes({norm(p["nome"]): p["id"] for p in pessoas})
    except Exception as e:  # noqa: BLE001
        print("  votações da ALECE falharam:", e)
    print("ALECE: %d votações nominais" % len(vots))
    return pessoas, vots


def completar(pessoas, ano=None):
    """Depois do TSE: liga projetos da ALECE aos autores e devolve os projetos enviados pelo governador."""
    ano = ano or datetime.date.today().year
    alece = [p for p in pessoas if p["casa"] == "alece"]
    try:
        doano = proposicoes(ano)
    except Exception as e:  # noqa: BLE001
        print("  proposições da ALECE falharam:", e)
        return []
    por, executivo = projetos_por_autor(doano, alece, ano)
    if any(por.values()):
        for p in alece:
            p["projetos"] = por.get(p["id"], [])
    return executivo
