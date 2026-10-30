"""Senadores do Ceará: API do Senado (https://legis.senado.leg.br/dadosabertos) e CEAPS (gastos)."""
import datetime

from comum import achar_coluna, classificar, get, homenagem, ler_csv, norm, numero_br, resumir_gastos

BASE = "https://legis.senado.leg.br/dadosabertos"
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
        })
    return por


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
            out.append({"id": "s%s" % cod_v, "casa": "senado", "data": data, "titulo": titulo, "descricao": ementa,
                        "temas": classificar(titulo + " " + ementa), "votos": {nome_id: voto}, "url": BASE + "/senador/%s" % cod})
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
            out.append({"tipo": ident.split(" ")[0] if ident else "", "numero": ident, "ano": ano, "ementa": em,
                        "temas": classificar(em), "homenagem": homenagem(em), "url": "https://www25.senado.leg.br/web/atividade/materias"})
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
        p = {"id": pid, "casa": "senado", "nome": nome, "partido": s.get("SiglaPartidoParlamentar"),
             "foto": s.get("UrlFotoParlamentar"), "email": s.get("EmailParlamentar"),
             "link": s.get("UrlPaginaParlamentar") or "https://www25.senado.leg.br/web/senadores/senador/-/perfil/%s" % cod}
        chave = next((k for k in ceaps if norm(nome) in k or k in norm(s.get("NomeCompletoParlamentar") or nome)), None)
        if chave:
            p["gastos"] = resumir_gastos(ceaps[chave])
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
