"""Deputados estaduais: Verba de Desempenho Parlamentar no Portal da Transparência da ALECE.

Fonte: https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar (CSV por mês).
O formato das colunas não é documentado; o robô procura as colunas pelo nome.
"""
import datetime
import html as htmllib
import io
import re

from comum import achar_coluna, classificar, get, ler_csv, norm, numero_br, resumir_gastos, slug

URL = "https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar/csv"
PAG_VOT = "https://transparencia.al.ce.gov.br/consultas-gerais/votacao-nominal"
SITE = "https://transparencia.al.ce.gov.br"
TETO_MENSAL = 36184.18  # Resolução 762/2023 e Ato Normativo 340/2023 (valor-base por gabinete)


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
            materia = re.sub(r"^.*?\d{2}/\d{2}/\d{4}", "", texto).strip()[:200] or texto[:200]
            out.append({"id": "a" + slug(url)[-40:], "casa": "alece", "data": "%s-%s-%s" % (dt.group(3), dt.group(2), dt.group(1)) if dt else "",
                        "titulo": materia, "descricao": texto[:400], "temas": classificar(texto), "votos": votos, "url": url})
        if len(out) >= maximo:
            break
    return out


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
        pessoas.append({"id": "a-" + slug(nome), "casa": "alece", "nome": nome, "partido": None, "foto": None, "email": None,
                        "link": "https://www.al.ce.gov.br/deputados", "gastos": g})
    print("ALECE: %d deputados com Verba de Desempenho em %d" % (len(pessoas), ano))
    vots = []
    try:
        vots = votacoes({norm(p["nome"]): p["id"] for p in pessoas})
    except Exception as e:  # noqa: BLE001
        print("  votações da ALECE falharam:", e)
    print("ALECE: %d votações nominais" % len(vots))
    return pessoas, vots
