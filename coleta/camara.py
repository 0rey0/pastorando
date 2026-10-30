"""Deputados federais do Ceará: API de dados abertos da Câmara (https://dadosabertos.camara.leg.br)."""
import datetime

from comum import classificar, get, homenagem, resumir_gastos

BASE = "https://dadosabertos.camara.leg.br/api/v2"
TIPOS_PROJETO = {"PL", "PLP", "PEC", "PDL", "MPV", "PLV"}


def paginas(caminho, params, limite=60):
    url, p = BASE + caminho, dict(params, itens=100)
    for _ in range(limite):
        j = get(url, p)
        for d in j.get("dados", []):
            yield d
        prox = next((l["href"] for l in j.get("links", []) if l.get("rel") == "next"), None)
        if not prox:
            break
        url, p = prox, None


def deputados():
    return list(paginas("/deputados", {"siglaUf": "CE", "ordem": "ASC", "ordenarPor": "nome"}))


def gastos(id_, ano):
    itens = []
    for d in paginas("/deputados/%s/despesas" % id_, {"ano": ano, "ordem": "DESC", "ordenarPor": "mes"}):
        itens.append({
            "mes": int(d.get("mes") or 0),
            "categoria": (d.get("tipoDespesa") or "Outros").strip().capitalize(),
            "fornecedor": (d.get("nomeFornecedor") or "").strip(),
            "cnpj": d.get("cnpjCpfFornecedor") or "",
            "valor": float(d.get("valorLiquido") or 0),
            "url": d.get("urlDocumento") or "",
        })
    return resumir_gastos(itens)


def projetos(id_, ano):
    out = []
    for p in paginas("/proposicoes", {"idDeputadoAutor": id_, "ano": ano, "ordem": "DESC", "ordenarPor": "id"}, limite=10):
        if p.get("siglaTipo") not in TIPOS_PROJETO:
            continue
        em = p.get("ementa") or ""
        out.append({
            "tipo": p.get("siglaTipo"), "numero": p.get("numero"), "ano": p.get("ano"),
            "ementa": em, "temas": classificar(em), "homenagem": homenagem(em),
            "url": "https://www.camara.leg.br/propostas-legislativas/%s" % p.get("id"),
        })
    return out


def votacoes(ids_ce, hoje, meses=6, maximo=120):
    """Votações nominais do plenário nos últimos meses, só com os votos dos deputados do Ceará."""
    lista = []
    for k in range(meses):
        mm, yy = hoje.month - k, hoje.year
        while mm <= 0:
            mm, yy = mm + 12, yy - 1
        ini = datetime.date(yy, mm, 1)
        fim = datetime.date(yy + (mm == 12), mm % 12 + 1, 1) - datetime.timedelta(days=1)
        fim = min(fim, hoje)
        try:
            for v in paginas("/votacoes", {"dataInicio": ini.isoformat(), "dataFim": fim.isoformat(), "ordem": "DESC", "ordenarPor": "dataHoraRegistro"}, limite=10):
                if v.get("siglaOrgao") == "PLEN":
                    lista.append(v)
        except Exception as e:  # noqa: BLE001
            print("  aviso: votações de", ini, "falharam:", e)
    vistos, unicas = set(), []
    for v in lista:
        if v["id"] not in vistos:
            vistos.add(v["id"])
            unicas.append(v)
    out = []
    for v in unicas[:maximo]:
        try:
            votos = get(BASE + "/votacoes/%s/votos" % v["id"]).get("dados", [])
        except Exception:  # noqa: BLE001
            continue
        ce = {}
        for x in votos:
            dep = x.get("deputado_") or {}
            if dep.get("id") in ids_ce:
                ce["c%s" % dep["id"]] = (x.get("tipoVoto") or "").strip()
        if not ce:
            continue
        desc = v.get("descricao") or ""
        obj = v.get("proposicaoObjeto") or ""
        out.append({
            "id": "c" + str(v["id"]), "casa": "camara", "data": (v.get("dataHoraRegistro") or v.get("data") or "")[:10],
            "titulo": obj or desc[:120], "descricao": desc, "temas": classificar(obj + " " + desc), "votos": ce,
            "url": BASE + "/votacoes/%s" % v["id"],
        })
    return out


def coletar(ano=None):
    hoje = datetime.date.today()
    ano = ano or hoje.year
    deps = deputados()
    print("Câmara: %d deputados do Ceará" % len(deps))
    pessoas = []
    for d in deps:
        id_ = d["id"]
        p = {"id": "c%s" % id_, "casa": "camara", "nome": d.get("nome"), "partido": d.get("siglaPartido"),
             "foto": d.get("urlFoto"), "email": d.get("email"),
             "link": "https://www.camara.leg.br/deputados/%s" % id_}
        try:
            p["gastos"] = gastos(id_, ano)
        except Exception as e:  # noqa: BLE001
            print("  gastos falharam para", d.get("nome"), e)
        try:
            p["projetos"] = projetos(id_, ano)
        except Exception as e:  # noqa: BLE001
            print("  projetos falharam para", d.get("nome"), e)
        pessoas.append(p)
    vots = votacoes({d["id"] for d in deps}, hoje)
    print("Câmara: %d votações nominais com votos do Ceará" % len(vots))
    return pessoas, vots
