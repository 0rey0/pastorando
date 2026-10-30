"""Deputados estaduais: Verba de Desempenho Parlamentar no Portal da Transparência da ALECE.

Fonte: https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar (CSV por mês).
O formato das colunas não é documentado; o robô procura as colunas pelo nome.
"""
import datetime
import html as htmllib
import io
import re

from comum import (achar_coluna, casar_nome, classificar, config, fonte, get, homenagem, lado_povo, ler, ler_csv, norm, numero_br,
                   resumir_gastos, salvar, slug)

URL = "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar/csv"
PAG_VOT = "https://transparencia.al.ce.gov.br/consultas-gerais/votacao-nominal"
SITE = "https://transparencia.al.ce.gov.br"
TETO_MENSAL = 36184.18  # Resolução 762/2023 e Ato Normativo 340/2023 (valor-base por gabinete)
TRAMIT = "https://www2.al.ce.gov.br/legislativo/tramit%d/%s%d_%02d.pdf"
TIPOS = {"pl": "PL", "pi": "Indicação", "plc": "PLC", "pec": "PEC"}
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


def ler_proposicao(texto):
    """Do PDF de tramitação: número, data, autor e ementa."""
    t = re.sub(r"[ \t]+", " ", texto)
    autor = re.search(r"Autor(?:ia)?\s*:\s*(.+)", t)
    ementa = re.search(r"Ementa\s*:\s*(.+?)(?:\n\s*\n|EXMO|Excelent|Senhor Presidente|Sala das|$)", t, flags=re.S | re.I)
    data = re.search(r"Data de autua[cç][aã]o\s*:?\s*(\d{2})/(\d{2})/(\d{4})", t, flags=re.I)
    if not autor or not ementa:
        return None
    em = re.sub(r"\s+", " ", ementa.group(1)).strip()
    return {"autor": re.sub(r"\s+", " ", autor.group(1)).strip().title(), "ementa": em[:1].upper() + em[1:].lower() if em.isupper() else em,
            "data": "%s-%s-%s" % (data.group(3), data.group(2), data.group(1)) if data else ""}


def proposicoes(ano, max_novas=350, falhas_seguidas=15):
    """Varre os PDFs de tramitação (pl1_26.pdf, pl2_26.pdf...) e guarda o que já leu em dados/alece_proposicoes.json."""
    banco = ler("alece_proposicoes.json", {}) or {}
    doano = banco.setdefault(str(ano), {})
    for tipo in TIPOS:
        ja = doano.setdefault(tipo, {})
        n = max([int(k) for k in ja] or [0]) + 1
        falhas = novas = 0
        while falhas < falhas_seguidas and novas < max_novas:
            url = TRAMIT % (ano, tipo, n, ano % 100)
            try:
                bruto = get(url, tipo="bytes", aceitar="application/pdf", tentativas=2)
            except Exception:  # noqa: BLE001
                falhas += 1
                n += 1
                continue
            info = ler_proposicao(_texto_pdf(bruto))
            falhas = 0
            if info:
                info["url"] = url
                ja[str(n)] = info
                novas += 1
            n += 1
        print("  ALECE %s %d: %d no total, %d novas" % (tipo, ano, len(ja), novas))
    salvar("alece_proposicoes.json", banco)
    return doano


def projetos_por_autor(doano, pessoas, ano):
    """Liga cada proposição ao(s) deputado(s) autor(es). Devolve {pid: [projetos]} e a lista do Poder Executivo."""
    por, executivo = {p["id"]: [] for p in pessoas}, []
    for tipo, itens in doano.items():
        for n, info in itens.items():
            em = info["ementa"]
            hom = homenagem(em)
            lado, palavra = lado_povo(em)
            pr = {"tipo": TIPOS.get(tipo, tipo.upper()), "numero": "%s/%d" % (n, ano), "ano": ano, "ementa": em, "data": info.get("data"),
                  "temas": classificar(em), "homenagem": hom, "lado": 0 if hom else lado, "palavra": None if hom else palavra, "url": info["url"]}
            autor = norm(info["autor"])
            if "executivo" in autor or "governador" in autor:
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
