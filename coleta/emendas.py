"""Emendas parlamentares de deputados federais e senadores do Ceará (Portal da Transparência, CGU).

1º caminho: arquivo completo de emendas (download livre, sem cadastro).
2º caminho: API do Portal, se houver uma chave gratuita guardada no segredo PORTAL_CHAVE do GitHub.
"""
import datetime
import os

from comum import achar_coluna, baixar, casar_nome, fonte, get, linhas_csv_zip, norm, numero_br

ARQUIVO = "https://portaldatransparencia.gov.br/download-de-dados/emendas-parlamentares/UNICO"
API = "https://api.portaldatransparencia.gov.br/api-de-dados/emendas"
PAGINA = "https://portaldatransparencia.gov.br/emendas"
# funções do orçamento que são serviço público direto para a população
SERVICOS = {"saude", "educacao", "assistencia social", "saneamento", "habitacao", "urbanismo", "trabalho", "direitos da cidadania",
            "cultura", "organizacao agraria", "agricultura", "gestao ambiental", "desporto e lazer", "ciencia e tecnologia"}


def _somar(reg, autor, ano, funcao, municipio, emp, pago, cod, tipo):
    r = reg.setdefault(autor, {"empenhado": 0.0, "pago": 0.0, "por_funcao": {}, "por_municipio": {}, "lista": [], "anos": set()})
    r["empenhado"] += emp
    r["pago"] += pago
    r["anos"].add(ano)
    f = funcao.title() or "Não informada"
    r["por_funcao"][f] = r["por_funcao"].get(f, 0) + pago
    if municipio:
        r["por_municipio"][municipio.title()] = r["por_municipio"].get(municipio.title(), 0) + pago
    r["lista"].append({"codigo": cod, "ano": ano, "funcao": f, "local": municipio.title(), "empenhado": round(emp, 2), "pago": round(pago, 2), "tipo": tipo})


def _do_arquivo(anos):
    caminho = baixar(ARQUIVO, "portal_emendas.zip", dias=1)
    reg, idx = {}, None
    for cab, l in linhas_csv_zip(caminho, ".csv"):
        if cab == "__cab__":
            idx = {k: achar_coluna(l, *v) for k, v in {
                "cod": ("codigo da emenda",), "ano": ("ano da emenda", "ano"), "tipo": ("tipo de emenda",), "autor": ("nome do autor",),
                "local": ("localidade de aplicacao", "localidade do gasto"), "mun": ("municipio",), "uf": ("uf",),
                "funcao": ("nome funcao", "funcao"), "emp": ("valor empenhado",), "pago": ("valor pago",)}.items()}
            continue
        try:
            ano = int(numero_br(l[idx["ano"]]))
        except (TypeError, ValueError, IndexError):
            continue
        if ano not in anos:
            continue
        local = l[idx["mun"]] if idx["mun"] is not None else l[idx["local"]] if idx["local"] is not None else ""
        _somar(reg, l[idx["autor"]].strip(), ano, l[idx["funcao"]] if idx["funcao"] is not None else "", local,
               numero_br(l[idx["emp"]]), numero_br(l[idx["pago"]]), l[idx["cod"]] if idx["cod"] is not None else "", l[idx["tipo"]] if idx["tipo"] is not None else "")
    return reg


def _da_api(nomes, anos, chave):
    reg = {}
    for nome in nomes:
        for ano in anos:
            for pag in range(1, 30):
                lote = get(API, {"nomeAutor": nome.upper(), "ano": ano, "pagina": pag}, cabecalhos={"chave-api-dados": chave})
                if not lote:
                    break
                for e in lote:
                    _somar(reg, e.get("autor") or e.get("nomeAutor") or nome, ano, e.get("funcao") or "", e.get("localidadeDoGasto") or "",
                           numero_br(e.get("valorEmpenhado")), numero_br(e.get("valorPago")), e.get("codigoEmenda") or "", e.get("tipoEmenda") or "")
    return reg


def coletar(pessoas):
    """Coloca p['emendas'] nos deputados federais e senadores. Devolve quantos foram encontrados."""
    hoje = datetime.date.today()
    anos = set(range(2023, hoje.year + 1))
    alvo = [p for p in pessoas if p["casa"] in ("camara", "senado")]
    reg = None
    try:
        reg = _do_arquivo(anos)
    except Exception as e:  # noqa: BLE001
        print("  arquivo de emendas indisponível:", e)
    if not reg and os.environ.get("PORTAL_CHAVE"):
        try:
            reg = _da_api([p["nome"] for p in alvo], sorted(anos), os.environ["PORTAL_CHAVE"])
        except Exception as e:  # noqa: BLE001
            print("  API de emendas falhou:", e)
    if not reg:
        return 0
    achados = 0
    autores = list(reg)
    for p in alvo:
        nomes = [p["nome"]] + [x for x in (p.get("nome_civil"), p.get("nome_urna")) if x]
        melhor = None
        for n in nomes:
            a, nota = casar_nome(n, autores, minimo=0.85)
            if a:
                melhor = a
                break
        if not melhor:
            continue
        r = reg[melhor]
        servicos = sum(v for f, v in r["por_funcao"].items() if norm(f) in SERVICOS)
        p["emendas"] = {
            "autor": melhor, "anos": sorted(r["anos"]), "empenhado": round(r["empenhado"], 2), "pago": round(r["pago"], 2),
            "pct_servicos": round(100 * servicos / r["pago"], 1) if r["pago"] else None,
            "por_funcao": sorted([[f, round(v, 2)] for f, v in r["por_funcao"].items()], key=lambda x: -x[1])[:10],
            "por_municipio": sorted([[m, round(v, 2)] for m, v in r["por_municipio"].items()], key=lambda x: -x[1])[:15],
            "maiores": sorted(r["lista"], key=lambda e: -e["pago"])[:15],
            "n": len(r["lista"]),
        }
        p.setdefault("fontes", {})["emendas"] = fonte("Portal da Transparência (CGU) · emendas parlamentares", PAGINA)
        achados += 1
    print("Emendas: %d parlamentares com emendas desde 2023" % achados)
    return achados
