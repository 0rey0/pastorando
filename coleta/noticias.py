"""Notícias dos principais jornais sobre as pautas do Radar, para o povo ficar de olho.

Nenhum dos jornais (O Povo, Diário do Nordeste, Folha, Estadão, G1) tem API aberta de notícias.
O robô lê o RSS público de cada um e a busca de notícias do Google filtrada pelo site do jornal.
Guardamos só título, link, jornal e data (o texto continua no site do jornal).
"""
import datetime
import email.utils
import re
import urllib.parse
import xml.etree.ElementTree as ET

from comum import agora, config, get, ler, norm, salvar

GOOGLE = "https://news.google.com/rss/search"
PROJETO = re.compile(r"\b(PL|PEC|PLP|PDL|MP|MPV)\s*(?:n[º°o.]*\s*)?(\d{1,5})\s*/\s*(\d{2,4})", re.I)


def _rss(url, params=None):
    bruto = get(url, params, tipo="bytes", aceitar="application/rss+xml,application/xml,text/xml,*/*")
    raiz = ET.fromstring(bruto)
    for it in raiz.iter("item"):
        tit = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        data = it.findtext("pubDate") or ""
        fonte_g = it.find("source")
        try:
            d = email.utils.parsedate_to_datetime(data).date().isoformat()
        except Exception:  # noqa: BLE001
            d = ""
        if tit and link:
            yield tit, link, d, (fonte_g.text if fonte_g is not None else None)


def temas_de(texto, temas, gerais):
    t = " " + norm(texto) + " "
    achados = [k for k, tema in temas.items() if any(p in t for p in tema["palavras"])]
    if not achados and any(norm(g) in t for g in gerais):
        achados = ["geral"]
    return achados


def coletar(pessoas, radar_pacote):
    cfg = config("noticias.json")
    rcfg = config("radar.json")
    temas = rcfg["temas"]
    hoje = datetime.date.today()
    limite = (hoje - datetime.timedelta(days=cfg.get("dias", 30))).isoformat()
    velho = ler("noticias.json", {}) or {}
    itens = {i["link"]: i for i in velho.get("itens", []) if (i.get("data") or "9999") >= limite}
    status = {}
    for f in cfg["fontes"]:
        n_antes = len(itens)
        brutos = []
        for u in f.get("rss", []):
            try:
                brutos += list(_rss(u))
            except Exception as e:  # noqa: BLE001
                print("  RSS de %s falhou (%s): %s" % (f["nome"], u, e))
        if cfg.get("busca_google_noticias"):
            grupos = [(k, t["palavras"][:4]) for k, t in temas.items()] + [("geral", cfg.get("termos_gerais", []))]
            for k, palavras in grupos:
                q = "(" + " OR ".join('"%s"' % p for p in palavras) + ") site:%s when:%dd" % (f["site"], cfg.get("dias", 30))
                try:
                    brutos += list(_rss(GOOGLE, {"q": q, "hl": "pt-BR", "gl": "BR", "ceid": "BR:pt-419"}))
                except Exception as e:  # noqa: BLE001
                    print("  busca de notícias (%s, %s) falhou: %s" % (f["nome"], k, e))
        for tit, link, d, _fonte in brutos:
            tit = re.sub(r"\s+-\s+[^-]{2,40}$", "", tit) if "news.google" in link else tit  # tira " - Nome do jornal"
            tm = temas_de(tit, temas, cfg.get("termos_gerais", []))
            if not tm or (d and d < limite):
                continue
            itens.setdefault(link, {"titulo": tit, "link": link, "fonte": f["nome"], "data": d, "temas": tm})
        status[f["nome"]] = len(itens) - n_antes
    # liga cada notícia a projetos do Radar e a políticos do Ceará citados pelo nome
    radar_itens = (radar_pacote or {}).get("itens", [])
    nomes = [(p["id"], norm(p["nome"])) for p in pessoas if len(norm(p["nome"]).split()) >= 2]
    for it in itens.values():
        t = norm(it["titulo"])
        it["radar"] = []
        for m in PROJETO.finditer(it["titulo"]):
            tipo = m.group(1).upper()
            tipos = {"MP", "MPV"} if tipo in ("MP", "MPV") else {tipo}
            ano = m.group(3) if len(m.group(3)) == 4 else "20" + m.group(3)
            numero = "%d/%s" % (int(m.group(2)), ano)
            it["radar"] += [r["id"] for r in radar_itens if r["numero"] == numero and (r["tipo"] or "").upper() in tipos]
        it["pessoas"] = [pid for pid, n in nomes if re.search(r"(?<![a-z])" + re.escape(n) + r"(?![a-z])", t)]
    vistos, unicos = set(), []
    for it in sorted(itens.values(), key=lambda i: i.get("data") or "", reverse=True):
        chave = re.sub(r"[^a-z0-9]", "", norm(it["titulo"]))[:80]
        if chave in vistos:
            continue
        vistos.add(chave)
        unicos.append(it)
    lista = unicos[: cfg.get("maximo", 300)]
    pacote = {"quando": agora(), "dias": cfg.get("dias", 30), "itens": lista, "por_fonte": status,
              "fontes": [{"nome": f["nome"], "site": f["site"]} for f in cfg["fontes"]],
              "temas": {k: t["nome"] for k, t in temas.items()} | {"geral": "Extrema-direita em geral"}}
    salvar("noticias.json", pacote)
    print("Notícias: %d no total (%s)" % (len(lista), ", ".join("%s +%d" % kv for kv in status.items())))
    return pacote
