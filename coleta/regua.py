"""Régua do Povo, versão automática.

Nenhum peso é escolhido à mão. Os pesos vêm de pesquisas de opinião (config/pesquisas.json):
  - o peso de cada dimensão vem do que o eleitor diz que mais pesa no voto;
  - dentro de "Trabalho nas prioridades do povo", cada tema vale o que a população aponta como maior problema.
Cada deputado é comparado só com colegas da mesma Casa.
"""
from comum import config

NOMES = {
    "honestidade": "Honestidade com o dinheiro público",
    "compromisso": "Compromisso e presença nas votações",
    "prioridades": "Trabalho nas prioridades do povo",
}
VOTOU = {"sim", "nao", "não", "abstencao", "abstenção", "obstrucao", "obstrução", "artigo 17", "art. 17", "s", "n", "abst", "abstencao/abstencao"}


def _pesos_dimensoes(cfg):
    soma = {}
    for item in cfg["atributos"]["itens"].values():
        soma[item["dimensao"]] = soma.get(item["dimensao"], 0) + item["pct"]
    total = sum(soma.values())
    return {k: v / total for k, v in soma.items()}


def _pesos_temas(cfg, casa):
    t = cfg["temas"][casa]
    if "igual_a" in t:
        t = cfg["temas"][t["igual_a"]]
    maior = max(t["itens"].values())
    return {k: v / maior for k, v in t["itens"].items()}


def _clamp(v):
    return max(0.0, min(100.0, v))


def _economia(pessoas):
    """Percentil de economia: quem gasta menos por mês pontua mais (0 a 100)."""
    vals = []
    for p in pessoas:
        g = p.get("gastos")
        if g and g.get("meses"):
            vals.append((p["id"], g["total"] / max(1, len(g["meses"]))))
    vals.sort(key=lambda x: x[1])
    n = len(vals)
    return {pid: (100.0 if n == 1 else 100.0 * (1 - i / (n - 1))) for i, (pid, _) in enumerate(vals)}


def calcular(pessoas, votacoes):
    cfg = config("pesquisas.json")
    pesos = _pesos_dimensoes(cfg)
    povo = cfg.get("votos_com_o_povo", {}).get("itens", [])
    resumo = {"dimensoes": {k: {"nome": NOMES[k], "peso": round(100 * v)} for k, v in pesos.items()},
              "fonte_dimensoes": {"texto": cfg["atributos"]["fonte"], "url": cfg["atributos"].get("url")},
              "temas": {}}
    for casa in ("alece", "camara", "senado"):
        grupo = [p for p in pessoas if p["casa"] == casa]
        if not grupo:
            continue
        pt = _pesos_temas(cfg, casa)
        t = cfg["temas"][casa]
        t = cfg["temas"][t["igual_a"]] if "igual_a" in t else t
        resumo["temas"][casa] = {"fonte": t["fonte"], "url": t.get("url"), "itens": t["itens"]}
        econ = _economia(grupo)
        vots = [v for v in votacoes if v["casa"] == casa]
        bruto_prior = {}
        for p in grupo:
            soma = 0.0
            for pr in p.get("projetos") or []:
                if pr.get("homenagem"):
                    continue
                soma += 1 + 2 * max([pt.get(tm, 0) for tm in pr.get("temas", [])] or [0])
            bruto_prior[p["id"]] = soma
        maior_prior = max(bruto_prior.values()) if bruto_prior else 0
        for p in grupo:
            dims = {}
            g = p.get("gastos")
            if g and g.get("total"):
                conc = g.get("maior_fornecedor_pct") or 0
                pena = min(100.0, max(0.0, (conc - 25) * 2))
                dims["honestidade"] = (_clamp(0.7 * econ.get(p["id"], 50) + 0.3 * (100 - pena)),
                                       "gasta %s que a média da Casa; maior fornecedor fica com %s%%" % ("menos" if econ.get(p["id"], 50) >= 50 else "mais", conc))
            if vots:
                part = sum(1 for v in vots if (v["votos"].get(p["id"]) or "").strip().lower() in VOTOU)
                dims["compromisso"] = (100.0 * part / len(vots), "votou em %d de %d votações nominais" % (part, len(vots)))
            if p.get("projetos") is not None and maior_prior:
                val = 100.0 * bruto_prior[p["id"]] / maior_prior
                det = "%d projetos, %d só de homenagem" % (len(p["projetos"]), sum(1 for x in p["projetos"] if x.get("homenagem")))
                alinh = [(v, item) for v in vots for item in povo if item.get("casa") == casa and item["busca"].lower() in (v["titulo"] + " " + v["descricao"]).lower()]
                if alinh:
                    ok = sum(1 for v, item in alinh if (v["votos"].get(p["id"]) or "").strip().lower() in (item["maioria"].lower(),))
                    val = 0.5 * val + 0.5 * 100.0 * ok / len(alinh)
                    det += "; votou com a maioria da população em %d de %d votações com pesquisa" % (ok, len(alinh))
                dims["prioridades"] = (_clamp(val), det)
            disp = {k: v for k, v in dims.items() if k in pesos}
            if len(disp) < 2:
                # Com uma dimensão só, a nota seria injusta. Mostra as partes disponíveis, sem nota.
                p["regua"] = {"nota": None, "parcial": True, "dims": [{"chave": k, "nome": NOMES[k], "peso": None, "valor": round(v[0]), "detalhe": v[1]} for k, v in disp.items()]}
                continue
            tot = sum(pesos[k] for k in disp)
            nota = sum(pesos[k] / tot * disp[k][0] for k in disp)
            p["regua"] = {"nota": round(nota), "parcial": len(disp) < len(pesos),
                          "dims": [{"chave": k, "nome": NOMES[k], "peso": round(100 * pesos[k] / tot), "valor": round(v[0]), "detalhe": v[1]} for k, v in disp.items()]}
        com = sorted([p for p in grupo if p.get("regua") and p["regua"]["nota"] is not None], key=lambda p: -p["regua"]["nota"])
        for i, p in enumerate(com):
            p["regua"]["pos"] = com[i - 1]["regua"]["pos"] if i and com[i - 1]["regua"]["nota"] == p["regua"]["nota"] else i + 1
            p["regua"]["de"] = len(com)
    return resumo
