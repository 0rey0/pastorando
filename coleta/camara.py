"""Deputados federais do Ceará: API de dados abertos da Câmara (https://dadosabertos.camara.leg.br)."""
import datetime
import re

from comum import (DIAG, achar_coluna, baixar, classificar, fonte, foto_existente, get, homenagem, linhas_csv_zip, norm,
                   numero_br, resumir_gastos, salvar_foto)

BASE = "https://dadosabertos.camara.leg.br/api/v2"
SITE = "https://www.camara.leg.br"
TIPOS_PROJETO = {"PL", "PLP", "PEC", "PDL", "MPV", "PLV"}
COTAS = "https://www.camara.leg.br/cotas/Ano-%d.csv.zip"


def paginas(caminho, params, limite=60):
    url, p = (caminho if caminho.startswith("http") else BASE + caminho), dict(params, itens=100)
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


def detalhe(id_):
    try:
        return get(BASE + "/deputados/%s" % id_).get("dados", {})
    except Exception as e:  # noqa: BLE001
        print("  detalhe falhou para", id_, e)
        return {}


def gastos(id_, ano):
    itens = []
    for d in paginas("/deputados/%s/despesas" % id_, {"ano": ano, "ordem": "DESC", "ordenarPor": "mes"}):
        itens.append({
            "mes": int(d.get("mes") or 0),
            "categoria": (d.get("tipoDespesa") or "Outros").strip().rstrip(".").capitalize(),
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
        hom = homenagem(em)
        out.append({
            "tipo": p.get("siglaTipo"), "numero": p.get("numero"), "ano": p.get("ano"),
            "ementa": em, "temas": classificar(em), "homenagem": hom,
            "url": SITE + "/propostas-legislativas/%s" % p.get("id"),
        })
    return out


def presenca(id_, ano):
    """Presença em sessões deliberativas do plenário, lida da página oficial do deputado."""
    try:
        html = get(SITE + "/deputados/%s/presenca-plenario/%d" % (id_, ano), tipo="bytes", aceitar="text/html").decode("utf-8", "ignore")
    except Exception as e:  # noqa: BLE001
        print("  presença indisponível para", id_, e)
        return None
    texto = norm(re.sub(r"<[^>]+>", " ", html))

    def n(*rotulos):
        for r in rotulos:
            m = re.search(re.escape(r) + r"\D{0,40}?(\d+)", texto)
            if m:
                return int(m.group(1))
        return None
    pres = n("presencas", "presenca")
    just = n("ausencias justificadas", "ausencia justificada") or 0
    injust = n("ausencias nao justificadas", "ausencia nao justificada") or 0
    if pres is None:
        return None
    total = pres + just + injust
    if not total:
        return None
    return {"presencas": pres, "justificadas": just, "nao_justificadas": injust, "sessoes": total,
            "pct": round(100 * pres / total, 1), "url": SITE + "/deputados/%s/presenca-plenario/%d" % (id_, ano)}


def viagens(ano, ids, nomes=None):
    """Trechos de passagens aéreas pagas pela cota (arquivo anual da Câmara). Devolve {id: [viagens]}."""
    try:
        caminho = baixar(COTAS % ano, "camara_cotas_%d.zip" % ano, dias=1)
    except Exception as e:  # noqa: BLE001
        print("  arquivo anual da cota indisponível:", e)
        return {}
    por, cab, idx = {}, None, {}
    alvo = {str(i) for i in ids}
    por_nome = {norm(n): str(i) for i, n in (nomes or {}).items()}
    dg = DIAG.setdefault("camara_viagens", {"linhas_ce": 0, "com_trecho": 0, "casadas": 0, "exemplo": None})
    for c, l in linhas_csv_zip(caminho, ".csv", filtro=lambda t: '"CE"' in t or ";CE;" in t):
        if c == "__cab__":
            cab = l
            idx = {k: achar_coluna(cab, *v) for k, v in {
                "id": ("idecadastro",), "uf": ("sguf",), "trecho": ("txttrecho",), "data": ("datemissao",), "valor": ("vlrliquido",),
                "forn": ("txtfornecedor",), "pass": ("txtpassageiro",), "tipo": ("txtdescricao",), "doc": ("urldocumento",),
                "id2": ("nudeputadoid",), "nome": ("txnomeparlamentar",)}.items()}
            dg["cabecalho"] = cab[:32]
            continue
        try:
            if l[idx["uf"]] != "CE":
                continue
            dg["linhas_ce"] += 1
            quem = next((l[idx[k]] for k in ("id", "id2") if idx.get(k) is not None and l[idx[k]] in alvo), None)
            if not quem and idx.get("nome") is not None:
                quem = por_nome.get(norm(l[idx["nome"]]))
            tr = l[idx["trecho"]].strip() if idx["trecho"] is not None else ""
        except (IndexError, TypeError):
            continue
        if tr:
            dg["com_trecho"] += 1
            if not dg["exemplo"]:
                dg["exemplo"] = l[:32]
        # desde 2025 a Câmara deixou o trecho em branco; a passagem ainda aparece pelo tipo de despesa
        eh_passagem = idx.get("tipo") is not None and "passage" in norm(l[idx["tipo"]])
        if not quem or not (tr or eh_passagem):
            continue
        dg["casadas"] += 1
        por.setdefault(quem, []).append({
            "data": (l[idx["data"]] or "")[:10], "trecho": tr, "valor": numero_br(l[idx["valor"]]),
            "empresa": l[idx["forn"]].strip().title() if idx["forn"] is not None else "",
            "passageiro": l[idx["pass"]].strip().title() if idx["pass"] is not None else "",
            "url": l[idx["doc"]] if idx["doc"] is not None and idx["doc"] < len(l) else ""})
    for k in por:
        por[k].sort(key=lambda v: v["data"], reverse=True)
    return por


def votacoes(ids_ce, hoje, meses=6, maximo=150):
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
        uri = v.get("uriProposicaoObjeto") or ""
        m = re.search(r"/proposicoes/(\d+)", uri)
        out.append({
            "id": "c" + str(v["id"]), "casa": "camara", "data": (v.get("dataHoraRegistro") or v.get("data") or "")[:10],
            "titulo": obj or desc[:120], "descricao": desc, "temas": classificar(obj + " " + desc), "votos": ce,
            "aprovada": v.get("aprovacao") in (1, "1", True) if v.get("aprovacao") is not None else None,
            "url": SITE + "/propostas-legislativas/%s" % m.group(1) if m else BASE + "/votacoes/%s" % v["id"],
            "dados": BASE + "/votacoes/%s/votos" % v["id"],
        })
    return out


def coletar(ano=None):
    hoje = datetime.date.today()
    ano = ano or hoje.year
    deps = deputados()
    print("Câmara: %d deputados do Ceará" % len(deps))
    via = viagens(ano, [d["id"] for d in deps], {d["id"]: d.get("nome", "") for d in deps})
    pessoas = []
    for d in deps:
        id_ = d["id"]
        pid = "c%s" % id_
        det = detalhe(id_)
        st = det.get("ultimoStatus") or {}
        gab = st.get("gabinete") or {}
        pag = SITE + "/deputados/%s" % id_
        p = {"id": pid, "casa": "camara", "nome": d.get("nome"), "partido": d.get("siglaPartido"),
             "email": d.get("email") or gab.get("email"), "telefone": ("(61) " + gab["telefone"]) if gab.get("telefone") else None,
             "gabinete": ("Gabinete %s, Anexo %s, Câmara dos Deputados" % (gab.get("sala"), gab.get("predio"))) if gab.get("sala") else None,
             "nome_civil": (det.get("nomeCivil") or "").title() or None, "cpf": det.get("cpf"),
             "redes": [u for u in (det.get("redeSocial") or []) if isinstance(u, str)],
             "link": pag, "situacao": st.get("situacao"), "condicao": st.get("condicaoEleitoral"),
             "fontes": {"perfil": fonte("Câmara dos Deputados · página oficial", pag),
                        "partido": fonte("Câmara dos Deputados · dados abertos do deputado", BASE + "/deputados/%s" % id_),
                        "gastos": fonte("Câmara · cota parlamentar (notas e recibos)", pag + "#gastos"),
                        "gastos_dados": fonte("Câmara · dados abertos da cota", BASE + "/deputados/%s/despesas?ano=%d&itens=100" % (id_, ano)),
                        "projetos": fonte("Câmara · propostas de autoria", SITE + "/busca-portal/proposicoes/pesquisa-simplificada?autor=%s" % id_),
                        "votos": fonte("Câmara · votações nominais do plenário", "https://dadosabertos.camara.leg.br/swagger/api.html#/Vota%C3%A7%C3%B5es"),
                        "redes": fonte("Câmara · redes sociais informadas pelo gabinete", BASE + "/deputados/%s" % id_)}}
        foto = None
        if d.get("urlFoto"):
            try:
                foto = salvar_foto(get(d["urlFoto"], tipo="bytes", aceitar="image/*"), pid)
            except Exception:  # noqa: BLE001
                foto = foto_existente(pid)
        p["foto"] = foto or foto_existente(pid)
        if p["foto"]:
            p["fontes"]["foto"] = fonte("Câmara · foto oficial", d.get("urlFoto"))
        try:
            p["gastos"] = gastos(id_, ano)
        except Exception as e:  # noqa: BLE001
            print("  gastos falharam para", d.get("nome"), e)
        try:
            p["projetos"] = projetos(id_, ano)
        except Exception as e:  # noqa: BLE001
            print("  projetos falharam para", d.get("nome"), e)
        pr = presenca(id_, ano)
        if pr:
            p["presenca"] = pr
            p["fontes"]["presenca"] = fonte("Câmara · presença no plenário em %d" % ano, pr["url"])
        if via.get(str(id_)):
            p["viagens"] = {"n": len(via[str(id_)]), "total": round(sum(v["valor"] for v in via[str(id_)]), 2), "ultimas": via[str(id_)][:20]}
            p["fontes"]["viagens"] = fonte("Câmara · arquivo anual da cota parlamentar (trechos das passagens)", COTAS % ano)
        pessoas.append(p)
    vots = votacoes({d["id"] for d in deps}, hoje)
    print("Câmara: %d votações nominais com votos do Ceará" % len(vots))
    return pessoas, vots
