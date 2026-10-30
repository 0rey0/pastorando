"""Radar do Retrocesso: projetos dessa agenda que estão andando, para o povo ficar de olho e cobrar.

Câmara: API de dados abertos (proposições com tramitação recente + palavras de config/radar.json).
Assembleia: proposições lidas dos PDFs de tramitação (dados/alece_proposicoes.json).
"""
import datetime
import re

from comum import agora, casar_nome, config, fonte, get, ler, norm, salvar

BASE = "https://dadosabertos.camara.leg.br/api/v2"
SITE = "https://www.camara.leg.br/propostas-legislativas/%s"
TIPOS = "PL,PLP,PEC,PDL,MPV"
ETAPAS = ["Apresentado", "Nas comissões", "No plenário", "Aprovado na Câmara", "Virou lei"]


def temas_de(texto, cfg):
    t = " " + norm(texto) + " "
    return [k for k, tema in cfg["temas"].items() if any(p in t for p in tema["palavras"])]


def etapa(st):
    """Em que pé está: 1 apresentado, 2 comissões, 3 plenário/urgência, 4 aprovado na Câmara, 5 virou lei. 0 = arquivado."""
    sit, org, reg = norm(st.get("descricaoSituacao")), (st.get("siglaOrgao") or "").upper(), norm(st.get("regime"))
    tram = norm(st.get("descricaoTramitacao")) + " " + norm(st.get("despacho"))
    if "arquivad" in sit or "retirad" in sit:
        return 0
    if "norma juridica" in sit or "transformad" in sit:
        return 5
    if "sancao" in sit or "senado" in sit or "remessa ao senado" in tram or org in ("SF", "MESA") and "remet" in tram:
        return 4
    if org == "PLEN" or "plenario" in sit or "urgencia" in reg:
        return 3
    if "parecer" in sit or "relator" in sit or "pronta para pauta" in sit or org not in ("", "PLEN"):
        return 2
    return 1


def _camara(cfg, hoje, maximo=60):
    ini = (hoje - datetime.timedelta(days=cfg.get("dias_movimento", 90))).isoformat()
    achados = {}
    for k, tema in cfg["temas"].items():
        for palavra in tema["palavras"]:
            try:
                j = get(BASE + "/proposicoes", {"keywords": palavra, "siglaTipo": TIPOS, "dataInicio": ini, "dataFim": hoje.isoformat(),
                                               "ordem": "DESC", "ordenarPor": "id", "itens": 100})
            except Exception as e:  # noqa: BLE001
                print("  radar: busca '%s' falhou: %s" % (palavra, e))
                continue
            for d in j.get("dados", []):
                if str(d["id"]) in map(str, cfg.get("excluir", [])):
                    continue
                if temas_de(d.get("ementa") or "", cfg):
                    achados[d["id"]] = d
    for i in cfg.get("fixos", {}).get("camara", []):
        achados.setdefault(int(i), {"id": int(i)})
    itens = []
    for pid in sorted(achados, reverse=True)[: maximo * 2]:
        try:
            d = get(BASE + "/proposicoes/%s" % pid).get("dados", {})
        except Exception as e:  # noqa: BLE001
            print("  radar: detalhe %s falhou: %s" % (pid, e))
            continue
        st = d.get("statusProposicao") or {}
        et = etapa(st)
        if et == 0:
            continue
        try:
            autores = [a.get("nome") for a in get(BASE + "/proposicoes/%s/autores" % pid).get("dados", [])][:6]
        except Exception:  # noqa: BLE001
            autores = []
        em = d.get("ementa") or ""
        itens.append({"id": "c%s" % pid, "casa": "camara", "tipo": d.get("siglaTipo"), "numero": "%s/%s" % (d.get("numero"), d.get("ano")), "ementa": em,
                      "temas": temas_de(em, cfg) or ["fixo"], "etapa": et, "etapa_txt": ETAPAS[et - 1], "situacao": st.get("descricaoSituacao") or "",
                      "orgao": st.get("siglaOrgao") or "", "regime": st.get("regime") or "", "ultimo_mov": (st.get("dataHora") or "")[:10],
                      "ultimo_txt": (st.get("descricaoTramitacao") or "") + (": " + st["despacho"] if st.get("despacho") else ""),
                      "autores": autores, "url": SITE % pid, "dados": BASE + "/proposicoes/%s" % pid})
        if len(itens) >= maximo:
            break
    return itens


def _alece(cfg, hoje):
    banco = (ler("alece_proposicoes.json", {}) or {}).get(str(hoje.year), {})
    itens = []
    for tipo, lista in banco.items():
        if tipo.startswith("_"):
            continue
        for n, info in lista.items():
            tm = temas_de(info.get("ementa") or "", cfg)
            if not tm:
                continue
            itens.append({"id": "a-%s%s-%d" % (tipo, n, hoje.year), "casa": "alece", "tipo": tipo.upper(), "numero": "%s/%d" % (n, hoje.year), "ementa": info["ementa"],
                          "temas": tm, "etapa": 1, "etapa_txt": "Em tramitação", "situacao": "Em tramitação na Assembleia", "orgao": "ALECE", "regime": "",
                          "ultimo_mov": info.get("data") or "", "ultimo_txt": "Apresentado", "autores": [info.get("autor") or ""], "url": info.get("url"), "dados": info.get("url")})
    return itens


def coletar(pessoas, votacoes):
    cfg = config("radar.json")
    hoje = datetime.date.today()
    itens = _camara(cfg, hoje) + _alece(cfg, hoje)
    # autores do Ceará e votações já feitas sobre o projeto
    for it in itens:
        grupo = [p for p in pessoas if p["casa"] == it["casa"]]
        it["autores_ce"] = sorted({a["id"] for nome in it["autores"] for a in [casar_nome(nome, grupo, chave=lambda p: [p["nome"]] + ([p["nome_civil"]] if p.get("nome_civil") else []), minimo=0.85)[0]] if a})
        rotulo = norm("%s %s" % (it["tipo"], it["numero"]))
        it["votacoes"] = [v["id"] for v in votacoes if v["casa"] == it["casa"] and rotulo and rotulo in norm(v.get("titulo", "") + " " + v.get("descricao", ""))]
    itens.sort(key=lambda x: (-x["etapa"], x["ultimo_mov"] or ""), reverse=False)
    itens.sort(key=lambda x: (x["etapa"], x["ultimo_mov"] or ""), reverse=True)
    pacote = {"titulo": cfg.get("titulo"), "dias": cfg.get("dias_movimento", 90), "temas": {k: t["nome"] for k, t in cfg["temas"].items()},
              "palavras": {k: t["palavras"] for k, t in cfg["temas"].items()}, "etapas": ETAPAS, "itens": itens, "quando": agora(),
              "fontes": {"camara": fonte("Câmara · dados abertos (proposições)", "https://dadosabertos.camara.leg.br/swagger/api.html#/Proposi%C3%A7%C3%B5es"),
                         "alece": fonte("ALECE · proposições em tramitação", "https://www.al.ce.gov.br/legislativo")}}
    salvar("radar.json", pacote)
    print("Radar: %d projetos de olho (%d no plenário ou além)" % (len(itens), sum(1 for i in itens if i["etapa"] >= 3)))
    return pacote
