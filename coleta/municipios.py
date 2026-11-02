"""Indicadores das 184 cidades do Ceará (IBGE Cidades) e as áreas prioritárias.

API de pesquisas do IBGE: https://servicodados.ibge.gov.br/api/docs/pesquisas
O IDHM é do Atlas do Desenvolvimento Humano (PNUD, Ipea, FJP), publicado pelo IBGE Cidades.
"""
import json
import os
import time

from comum import DIAG, RAIZ, agora, fonte, get, ler, norm, salvar, slug

LOCAIS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/23/municipios"
# o mesmo endereço que o IBGE Cidades usa (não precisa saber a pesquisa); o segundo é o caminho antigo, por pesquisa
API = "https://servicodados.ibge.gov.br/api/v1/pesquisas/indicadores/%s/resultados/%s"
API_PESQ = "https://servicodados.ibge.gov.br/api/v1/pesquisas/%s/indicadores/%s/resultados/%s"
# chave: (pesquisa, indicador ou lista de indicadores em ordem de preferência, nome, unidade, maior_é_melhor)
INDICADORES = {
    "pop": ("10102", [96385, 29171], "População", "pessoas", None),
    "idhm": ("37", [329756, 30255], "IDHM (desenvolvimento humano)", "índice de 0 a 1", True),
    "idhm_r": ("37", 30257, "IDHM Renda", "índice de 0 a 1", True),
    "idhm_l": ("37", 30259, "IDHM Longevidade", "índice de 0 a 1", True),
    "idhm_e": ("37", 30261, "IDHM Educação", "índice de 0 a 1", True),
    "pib_pc": ("38", 47001, "PIB por pessoa", "R$ por ano", True),
    "renda_pc": (None, None, "Renda média por pessoa", "R$ por mês", True),
    "alfabetizacao": (None, None, "Pessoas de 15 anos ou mais que sabem ler e escrever", "%", True),
    "esgoto_rede": (None, None, "Casas ligadas à rede de esgoto", "% dos domicílios", True),
    "agua_rede": (None, None, "Casas com água da rede geral", "% dos domicílios", True),
    "lixo_coletado": (None, None, "Casas com coleta de lixo", "% dos domicílios", True),
    "pretos_pardos": (None, None, "Pessoas pretas e pardas", "% da população", None),
    "mort_inf": ("39", 30279, "Mortalidade infantil", "óbitos por mil nascidos vivos", False),
    "escolar": ("40", 60045, "Crianças de 6 a 14 anos na escola", "%", True),
    "pind": (None, None, "Pessoas em extrema pobreza", "% da população", False),
}
# cópias fixas guardadas no repositório, na ordem de preferência (a API do IBGE não responde aos servidores do GitHub)
FIXAS = [("censo2022_ce.json", "2022", {"pop": "pop", "renda_pc": "renda_pc_2022", "alfabetizacao": "alfabetizacao", "esgoto_rede": "esgoto_rede",
                                         "agua_rede": "agua_rede", "lixo_coletado": "lixo_coletado", "pretos_pardos": "pretos_pardos", "pib_pc": "pib_pc"}),
         ("atlas_ce_2010.json", "2010", {"pop": "pop", "idhm": "idhm", "idhm_r": "idhm_r", "idhm_l": "idhm_l", "idhm_e": "idhm_e",
                                         "mort_inf": "mort_inf", "escolar": "escolar", "pind": "pind", "renda_pc": "renda_pc"})]
ANO_FIXO = {"pib_pc": "2023"}
# o que entra no índice de prioridade (quanto pior, mais prioridade): o Censo 2022 primeiro, mais o IDHM
PRIORIDADE = ["renda_pc", "alfabetizacao", "esgoto_rede", "agua_rede", "lixo_coletado", "idhm"]
DIAS = 7
VERSAO = 2  # suba quando mudar os indicadores, para refazer o cálculo guardado


def _num(v):
    try:
        return float(str(v).replace(",", "."))
    except (TypeError, ValueError):
        return None


def _baixar(pesq, ind, lote):
    """Tenta o endereço do IBGE Cidades e, se falhar, o caminho por pesquisa."""
    erro = None
    for url in (API % (ind, lote), API_PESQ % (pesq, ind, lote)):
        try:
            return get(url, timeout=45, tentativas=2)
        except Exception as e:  # noqa: BLE001
            erro = e
    raise erro


def _resultados(pesq, inds, codigos):
    """Valores mais recentes por cidade. A API de pesquisas usa o código da cidade com 6 dígitos."""
    for ind in (inds if isinstance(inds, list) else [inds]):
        out = _resultados_um(pesq, ind, codigos)
        if out:
            return out
    return {}


def _resultados_um(pesq, ind, codigos):
    out, erros = {}, 0
    seis = sorted({c[:6] for c in codigos})
    for i in range(0, len(seis), 40):
        lote = "|".join(seis[i:i + 40])
        try:
            j = _baixar(pesq, ind, lote)
            erros = 0
        except Exception as e:  # noqa: BLE001
            print("  IBGE indicador %s falhou: %s" % (ind, e))
            DIAG.setdefault("ibge_erros", {})[str(ind)] = str(e)[:160]
            erros += 1
            if erros >= 2 and not out:
                break  # o IBGE não está respondendo esse indicador; tenta o próximo
            continue
        for bloco in j if isinstance(j, list) else [j]:
            for r in bloco.get("res", []):
                serie = r.get("res") or {}
                anos = sorted((a for a, v in serie.items() if _num(v) is not None), reverse=True)
                if anos:
                    out[str(r.get("localidade"))[:6]] = (_num(serie[anos[0]]), anos[0])
    return out


def _fixa(arq):
    try:
        with open(os.path.join(RAIZ, "config", arq), encoding="utf-8") as f:
            return json.load(f)["municipios"]
    except (OSError, ValueError, KeyError):
        return {}


def pagina_ibge(nome):
    return "https://cidades.ibge.gov.br/brasil/ce/%s/panorama" % slug(nome)


def faixa_idhm(v):
    if v is None:
        return None
    return "muito baixo" if v < .5 else "baixo" if v < .6 else "médio" if v < .7 else "alto" if v < .8 else "muito alto"


def coletar(pessoas, forcar=False):
    velho = ler("municipios.json", {}) or {}
    tem_dados = any(d.get("idhm") is not None for d in (velho.get("municipios") or {}).values())
    if not forcar and tem_dados and velho.get("versao") == VERSAO and velho.get("epoch", 0) > time.time() - DIAS * 86400:
        base = velho
        print("Municípios: usando indicadores guardados de", velho.get("quando"))
    else:
        ibge_ok = True
        try:
            locais = get(LOCAIS, timeout=40, tentativas=3)
            nomes = {str(m["id"]): m["nome"] for m in locais}
        except Exception as e:  # noqa: BLE001 - plano B: os códigos do IBGE que estão no mapa do site
            print("  lista de cidades do IBGE falhou (%s); usando o mapa do site" % e)
            DIAG["ibge_localidades"] = str(e)[:200]
            with open(os.path.join(RAIZ, "site", "mapa-ce.json"), encoding="utf-8") as f:
                mapa = json.load(f)["municipios"]
            nomes = {str(m["ibge"]): n for n, m in mapa.items() if m.get("ibge")}
            ibge_ok = False  # o IBGE não respondeu nem a lista de cidades; não vale esperar pelos indicadores
        cods = sorted(nomes)
        muni = {nomes[c]: {"ibge": c} for c in cods}
        anos = {}
        for k, (pesq, ind, *_r) in INDICADORES.items():
            if ind is None or not ibge_ok:
                continue
            res = _resultados(pesq, ind, cods)
            por6 = {c[:6]: c for c in cods}
            for c6, (v, ano) in res.items():
                c = por6.get(c6)
                if c:
                    muni[nomes[c]][k] = v
                    anos[k] = max(anos.get(k, ""), ano)
        # o que o IBGE não respondeu vem das cópias fixas: Censo 2022 primeiro, depois o Atlas (Censo 2010)
        for arq, ano_f, campos in FIXAS:
            fixo = _fixa(arq)
            usados = 0
            for nome, d in muni.items():
                f = fixo.get(nome) or fixo.get(next((n for n in fixo if norm(n) == norm(nome)), ""), {})
                for k, campo in campos.items():
                    if d.get(k) is None and f.get(campo) is not None:
                        d[k] = f[campo]
                        anos.setdefault(k, ANO_FIXO.get(k, ano_f))
                        usados += 1
            if usados:
                print("  %s completou %d números" % (arq, usados))
        base = {"municipios": muni, "anos": anos}
    muni = base["municipios"]
    # índice de prioridade: média das posições (0 = melhor do estado, 100 = pior)
    pos = {}
    for k in PRIORIDADE:
        melhor = INDICADORES[k][4]
        vals = sorted([(n, d[k]) for n, d in muni.items() if d.get(k) is not None], key=lambda x: x[1], reverse=bool(melhor))
        n = len(vals)
        for i, (nome, _) in enumerate(vals):
            pos.setdefault(nome, []).append(100.0 * i / max(1, n - 1))
    for nome, d in muni.items():
        d["prioridade"] = round(sum(pos[nome]) / len(pos[nome]), 1) if len(pos.get(nome, [])) >= 3 else None
        d["faixa_idhm"] = faixa_idhm(d.get("idhm"))
    ordem = sorted([n for n in muni if muni[n].get("prioridade") is not None], key=lambda n: -muni[n]["prioridade"])
    for i, n in enumerate(ordem):
        muni[n]["pos_prioridade"] = i + 1
    # emendas pagas por habitante (soma de deputados federais e senadores)
    chave = {norm(n).replace(" ", ""): n for n in muni}
    em = {}
    for p in pessoas:
        for m, v in ((p.get("emendas") or {}).get("por_municipio") or []):
            n = chave.get(norm(m).replace(" ", ""))
            if n:
                em[n] = em.get(n, 0) + v
    for n, d in muni.items():
        d["emendas"] = round(em.get(n, 0), 2)
        d["emendas_pc"] = round(em.get(n, 0) / d["pop"], 2) if d.get("pop") else None
    pacote = {"versao": VERSAO, "quando": base.get("quando") or agora(), "epoch": base.get("epoch") or int(time.time()), "anos": base.get("anos", {}),
              "indicadores": {k: {"nome": v[2], "unidade": v[3], "maior_melhor": v[4]} for k, v in INDICADORES.items()},
              "prioridade_usa": PRIORIDADE, "municipios": muni,
              "fontes": {"ibge": fonte("IBGE Cidades", "https://cidades.ibge.gov.br/brasil/ce/panorama"),
                         "idhm": fonte("Atlas do Desenvolvimento Humano no Brasil (PNUD, Ipea, FJP)", "http://www.atlasbrasil.org.br/"),
                         "api": fonte("IBGE · API de pesquisas", "https://servicodados.ibge.gov.br/api/docs/pesquisas"),
                         "atlas": fonte("Atlas Brasil · planilha municipal (Censo 2010)", "http://www.atlasbrasil.org.br/acervo/biblioteca"),
                         "censo": fonte("IBGE · Censo Demográfico 2022", "https://censo2022.ibge.gov.br/panorama/")}}
    salvar("municipios.json", pacote)
    print("Municípios: %d cidades; %d com índice de prioridade" % (len(muni), len(ordem)))
    return pacote
