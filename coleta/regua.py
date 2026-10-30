"""Régua do Povo, versão 3: regras públicas, sem pesquisa de opinião.

A nota privilegia quem defende serviços públicos e direitos do povo trabalhador (config/regua.json):
  1. votos a favor do povo           (votações classificadas pelas palavras de config/regua.json)
  2. projetos a favor do povo        (idem; homenagens não contam)
  3. dinheiro público                (economia na verba + emendas em serviço público, quando houver)
  4. presença e participação
  5. independência do dinheiro grande (financiamento da campanha no TSE)
Cada parlamentar é comparado só com colegas da mesma Casa.
"""
from comum import config, lado_povo, norm

SIM = ("sim", "s")
NAO = ("nao", "não", "n")
VOTOU = {"sim", "nao", "não", "abstencao", "abstenção", "obstrucao", "obstrução", "artigo 17", "art. 17", "s", "n", "abst", "p-nrv"}


def _clamp(v):
    return max(0.0, min(100.0, v))


def _voto(v):
    x = norm(v)
    if x in SIM or x.startswith("sim"):
        return "sim"
    if x in ("nao", "n") or x.startswith("nao"):
        return "nao"
    if x.startswith("abst") or x.startswith("obstr"):
        return "abst"
    return None


def classificar_votacoes(votacoes):
    """Marca em cada votação: lado = 1 (votar SIM é a favor do povo), -1 (votar NÃO é a favor), 0 (neutra) e o motivo."""
    cfg = config("regua.json")
    manuais = (config("votacoes_manuais.json").get("itens") or {})
    ignorar = cfg.get("ignorar_votacao", [])
    for v in votacoes:
        m = manuais.get(v["id"])
        if m:
            val = m if isinstance(m, str) else m.get("lado", "")
            v["lado"] = {"a_favor": 1, "contra": -1}.get(val, 0)
            v["motivo"] = (m.get("motivo") if isinstance(m, dict) else "") or "classificação revisada à mão"
            v["manual"] = True
            continue
        texto = (v.get("titulo") or "") + " " + (v.get("descricao") or "")
        if any(p in norm(texto) for p in ignorar):
            v["lado"], v["motivo"] = 0, "votação de procedimento"
            continue
        lado, palavra = lado_povo(texto)
        # "Rejeitado o projeto/emenda": o sentido de SIM continua sendo aprovar a matéria
        v["lado"] = lado
        v["motivo"] = ("fala de “%s”" % palavra) if palavra else "tema sem relação direta com serviços públicos ou direitos"
    return votacoes


def _percentil_economia(grupo):
    vals = []
    for p in grupo:
        g = p.get("gastos")
        if g and g.get("meses"):
            vals.append((p["id"], g["total"] / max(1, len(g["meses"]))))
    vals.sort(key=lambda x: x[1])
    n = len(vals)
    return {pid: (100.0 if n == 1 else 100.0 * (1 - i / (n - 1))) for i, (pid, _) in enumerate(vals)}


def _projetos_bruto(p):
    fav = contra = neutro = hom = 0
    for pr in p.get("projetos") or []:
        if pr.get("homenagem"):
            hom += 1
            continue
        lado = pr.get("lado")
        if lado is None:
            lado = lado_povo(pr.get("ementa") or "")[0]
        if lado > 0:
            fav += 1
        elif lado < 0:
            contra += 1
        else:
            neutro += 1
    return fav - 2 * contra + 0.2 * neutro, fav, contra, neutro, hom


def _independencia(r):
    if not r or not r.get("total"):
        return None
    t = r["total"]
    v = 100.0 * (r.get("pequenas", 0) + 0.6 * r.get("medias", 0) + 0.5 * r.get("publico", 0) + 0.5 * r.get("outros", 0)) / t
    return _clamp(v)


def calcular(pessoas, votacoes):
    cfg = config("regua.json")
    D = cfg["dimensoes"]
    pesos = {k: d["peso"] for k, d in D.items()}
    classificar_votacoes(votacoes)
    resumo = {"versao": 3, "dimensoes": {k: {"nome": d["nome"], "peso": d["peso"], "explica": d["explica"]} for k, d in D.items()},
              "a_favor_do_povo": cfg["a_favor_do_povo"], "contra_o_povo": cfg["contra_o_povo"], "inversores": cfg.get("inversores", []),
              "votacoes_classificadas": {}}
    for casa in ("alece", "camara", "senado"):
        grupo = [p for p in pessoas if p["casa"] == casa]
        if not grupo:
            continue
        vots = [v for v in votacoes if v["casa"] == casa]
        marcadas = [v for v in vots if v.get("lado")]
        resumo["votacoes_classificadas"][casa] = {"total": len(vots), "a_favor": sum(1 for v in marcadas if v["lado"] == 1),
                                                  "contra": sum(1 for v in marcadas if v["lado"] == -1)}
        econ = _percentil_economia(grupo)
        brutos = {p["id"]: _projetos_bruto(p) for p in grupo if not p.get("fora_exercicio")}
        maior = max([b[0] for b in brutos.values()] + [0])
        for p in grupo:
            if p.get("fora_exercicio"):
                p["regua"] = {"nota": None, "parcial": True, "dims": [], "fora": True}
                continue
            dims = {}
            # 1. votos a favor do povo
            pontos, n, lista = 0.0, 0, []
            for v in marcadas:
                x = _voto((v["votos"].get(p["id"]) or ""))
                if not x:
                    continue
                n += 1
                certo = (x == "sim" and v["lado"] == 1) or (x == "nao" and v["lado"] == -1)
                pontos += 100 if certo else (25 if x == "abst" else 0)
                lista.append(v["id"])
            if n >= 3:
                dims["votos_povo"] = (pontos / n, "votou a favor do povo em %d de %d votações que tratam de serviços públicos e direitos" % (round(pontos / 100), n), "votos")
            # 2. projetos
            b = brutos[p["id"]]
            if p.get("projetos") is not None and maior > 0:
                dims["projetos_povo"] = (_clamp(100.0 * b[0] / maior),
                                         "%d projetos a favor do povo, %d contra, %d sem relação direta, %d só de homenagem" % (b[1], b[2], b[3], b[4]), "projetos")
            # 3. dinheiro público
            g = p.get("gastos")
            if g and g.get("total"):
                conc = g.get("maior_fornecedor_pct") or 0
                pena = min(100.0, max(0.0, (conc - 25) * 2))
                val = 0.6 * econ.get(p["id"], 50) + 0.4 * (100 - pena)
                det = "gasta %s que a média da Casa; maior fornecedor fica com %s%%" % ("menos" if econ.get(p["id"], 50) >= 50 else "mais", str(conc).replace(".", ","))
                em = p.get("emendas")
                if em and em.get("pct_servicos") is not None:
                    val = 0.5 * val + 0.5 * em["pct_servicos"]
                    det += "; %s%% das emendas pagas foram para saúde, educação, assistência e outros serviços" % str(round(em["pct_servicos"])).replace(".", ",")
                dims["dinheiro"] = (_clamp(val), det, "gastos")
            # 4. presença
            pr = p.get("presenca")
            if pr and pr.get("pct") is not None:
                dims["presenca"] = (_clamp(pr["pct"]), "presente em %d de %d sessões deliberativas" % (pr["presencas"], pr["sessoes"]), "presenca")
            elif vots:
                part = sum(1 for v in vots if (v["votos"].get(p["id"]) or "").strip().lower() in VOTOU)
                dims["presenca"] = (100.0 * part / len(vots), "votou em %d de %d votações nominais (a Casa não publica a presença em formato aberto)" % (part, len(vots)), "votos")
            # 5. independência
            ind = _independencia(p.get("receitas"))
            if ind is not None:
                r = p["receitas"]
                dims["independencia"] = (ind, "campanha de %d: %s%% de doações pequenas, %s%% de grandes doadores, %s%% do próprio bolso" % (
                    r.get("ano", 2022), round(100 * r["pequenas"] / r["total"]), round(100 * r["grandes"] / r["total"]), round(100 * r["proprios"] / r["total"])), "receitas")
            itens = [{"chave": k, "nome": D[k]["nome"], "peso": None, "valor": round(v[0]), "detalhe": v[1], "fonte": v[2]} for k, v in dims.items()]
            if len(dims) < 3:
                p["regua"] = {"nota": None, "parcial": True, "dims": itens}
                continue
            tot = sum(pesos[k] for k in dims)
            nota = sum(pesos[k] / tot * dims[k][0] for k in dims)
            for it in itens:
                it["peso"] = round(100 * pesos[it["chave"]] / tot)
            p["regua"] = {"nota": round(nota), "parcial": len(dims) < len(pesos), "dims": itens,
                          "faltam": [D[k]["nome"] for k in pesos if k not in dims]}
        com = sorted([p for p in grupo if p.get("regua") and p["regua"]["nota"] is not None], key=lambda p: -p["regua"]["nota"])
        for i, p in enumerate(com):
            p["regua"]["pos"] = com[i - 1]["regua"]["pos"] if i and com[i - 1]["regua"]["nota"] == p["regua"]["nota"] else i + 1
            p["regua"]["de"] = len(com)
    return resumo
