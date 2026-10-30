"""Governo do Ceará: para onde vai o dinheiro do estado (Tesouro Nacional, Siconfi) e o que o governador promete e envia à ALECE.

Siconfi: Relatório Resumido da Execução Orçamentária (RREO), anexo 2, despesa por função.
API: https://apidatalake.tesouro.gov.br/docs/siconfi/
"""
import datetime

from comum import fonte, get, norm

API = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo"
ID_CE = 23
PAGINA = "https://siconfi.tesouro.gov.br/siconfi/pages/public/consulta_finbra_rreo/finbra_rreo_list.jsf"
FUNCOES = ["Legislativa", "Judiciária", "Essencial à Justiça", "Administração", "Defesa Nacional", "Segurança Pública", "Relações Exteriores",
           "Assistência Social", "Previdência Social", "Saúde", "Trabalho", "Educação", "Cultura", "Direitos da Cidadania", "Urbanismo",
           "Habitação", "Saneamento", "Gestão Ambiental", "Ciência e Tecnologia", "Agricultura", "Organização Agrária", "Indústria",
           "Comércio e Serviços", "Comunicações", "Energia", "Transporte", "Desporto e Lazer", "Encargos Especiais"]
SERVICOS = {"Saúde", "Educação", "Assistência Social", "Habitação", "Saneamento", "Trabalho", "Direitos da Cidadania", "Cultura",
            "Organização Agrária", "Desporto e Lazer", "Urbanismo", "Gestão Ambiental"}
NFUNC = {norm(f): f for f in FUNCOES}


def _anexo(ano, bim):
    j = get(API, {"an_exercicio": ano, "nr_periodo": bim, "co_tipo_demonstrativo": "RREO", "no_anexo": "RREO-Anexo 02", "id_ente": ID_CE})
    return j.get("items", [])


def despesa_por_funcao(ano, bim):
    itens = _anexo(ano, bim)
    if not itens:
        return None
    col_liq = col_dot = None
    for it in itens:
        c = norm(it.get("coluna"))
        if "liquidadas ate o bimestre" in c and col_liq is None:
            col_liq = it.get("coluna")
        if "dotacao atualizada" in c and col_dot is None:
            col_dot = it.get("coluna")
    liq, dot = {}, {}
    for it in itens:
        f = NFUNC.get(norm(it.get("conta")))
        if not f:
            continue
        v = float(it.get("valor") or 0)
        if it.get("coluna") == col_liq:
            liq[f] = max(liq.get(f, 0), v)  # a linha "exceto intra-orçamentária" é a maior
        elif it.get("coluna") == col_dot:
            dot[f] = max(dot.get(f, 0), v)
    if not liq:
        return None
    total = sum(liq.values())
    serv = sum(v for f, v in liq.items() if f in SERVICOS)
    return {"ano": ano, "bimestre": bim, "total": round(total, 2), "pct_servicos": round(100 * serv / total, 1) if total else None,
            "funcoes": sorted([[f, round(v, 2), round(dot.get(f, 0), 2), f in SERVICOS] for f, v in liq.items() if v > 0], key=lambda x: -x[1]),
            "fonte": fonte("Tesouro Nacional · Siconfi, RREO anexo 2 (%dº bimestre de %d)" % (bim, ano), PAGINA),
            "dados": API + "?an_exercicio=%d&nr_periodo=%d&co_tipo_demonstrativo=RREO&no_anexo=RREO-Anexo%%2002&id_ente=%d" % (ano, bim, ID_CE)}


def orcamento():
    hoje = datetime.date.today()
    out = {}
    for ano in (hoje.year, hoje.year - 1):
        for bim in range(6, 0, -1):
            if ano == hoje.year and bim > (hoje.month + 1) // 2:
                continue
            try:
                r = despesa_por_funcao(ano, bim)
            except Exception as e:  # noqa: BLE001
                print("  Siconfi %d/%d indisponível: %s" % (bim, ano, e))
                r = None
            if r:
                out[str(ano)] = r
                break
    return out


def coletar(pacote_tse, executivo, votacoes_alece):
    """Monta o que o site mostra na página do governo."""
    g = {"orcamento": orcamento()}
    tse = pacote_tse or {}
    gv = tse.get("governo") or {}
    if gv.get("atual"):
        g["governador"] = gv["atual"]
    if gv.get("eleito2026"):
        g["eleito2026"] = gv["eleito2026"]
    g["mensagens"] = executivo[:60]
    temas = {}
    for x in executivo:
        for t in x.get("temas") or ["outros"]:
            temas[t] = temas.get(t, 0) + 1
    g["mensagens_resumo"] = {"total": len(executivo), "por_tema": sorted(temas.items(), key=lambda kv: -kv[1])}
    g["fontes"] = {"mensagens": fonte("ALECE · proposições do Poder Executivo (PDF de cada uma)", "https://www.al.ce.gov.br/legislativo"),
                   "governador": fonte("TSE · candidatos %s" % ((gv.get("atual") or {}).get("ano") or 2022), (tse.get("fontes") or {}).get("2022", {}).get("candidatos")),
                   "portal": fonte("Ceará Transparente (portal do governo do estado)", "https://cearatransparente.ce.gov.br/")}
    print("Governo: orçamento de %s; %d projetos do Executivo na ALECE" % (", ".join(sorted(g["orcamento"])) or "nenhum ano", len(executivo)))
    return g
