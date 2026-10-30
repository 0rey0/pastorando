"""Avisos de graça, sem guardar dado de ninguém:
  - um feed RSS por político (site/feeds/{id}.xml), que qualquer leitor de RSS ou o próprio Telegram/Feedly acompanham;
  - um resumo diário num canal público do Telegram, se os segredos TELEGRAM_TOKEN e TELEGRAM_CANAL existirem.
"""
import datetime
import json
import os
import urllib.parse
import urllib.request
from xml.sax.saxutils import escape

from comum import RAIZ

FEEDS = os.path.join(RAIZ, "site", "feeds")
CASA = {"alece": "Assembleia", "camara": "Câmara", "senado": "Senado"}


def endereco_site():
    if os.environ.get("SITE_URL"):
        return os.environ["SITE_URL"].rstrip("/") + "/"
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    if "/" in repo:
        dono, nome = repo.split("/", 1)
        return "https://%s.github.io/%s/" % (dono.lower(), nome)
    return "./"


def _data_rss(d):
    try:
        dt = datetime.datetime.strptime((d or "")[:10], "%Y-%m-%d")
    except ValueError:
        dt = datetime.datetime.now()
    return dt.strftime("%a, %d %b %Y 12:00:00 -0300")


def _voto_txt(v):
    x = (v or "").lower()
    return "SIM" if x.startswith("sim") else "NÃO" if x.startswith("n") and len(x) <= 4 or x.startswith("não") or x.startswith("nao") else (v or "não votou").upper()


def feeds(pessoas, votacoes):
    os.makedirs(FEEDS, exist_ok=True)
    site = endereco_site()
    por = {}
    for v in votacoes:
        for pid in v.get("votos", {}):
            por.setdefault(pid, []).append(v)
    for p in pessoas:
        itens = []
        for v in por.get(p["id"], [])[:15]:
            itens.append((v.get("data"), "Votou %s: %s" % (_voto_txt(v["votos"][p["id"]]), v["titulo"]), v.get("url") or site, v.get("descricao") or ""))
        for pr in (p.get("projetos") or [])[:10]:
            itens.append((pr.get("data") or "%s-01-01" % pr.get("ano"), "Apresentou %s %s" % (pr.get("tipo") or "", pr.get("numero") or ""), pr.get("url") or site, pr.get("ementa") or ""))
        for g in ((p.get("gastos") or {}).get("ultimos") or [])[:5]:
            itens.append(("%s-%02d-28" % (datetime.date.today().year, g.get("mes") or 1), "Gasto de R$ %s com %s" % (("%.2f" % g["valor"]).replace(".", ","), g.get("fornecedor") or g.get("categoria")), g.get("url") or site, g.get("categoria") or ""))
        itens.sort(key=lambda x: x[0] or "", reverse=True)
        xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0"><channel>',
               "<title>%s · EspiaCE</title>" % escape(p["nome"]), "<link>%s#p-%s</link>" % (escape(site), escape(p["id"])),
               "<description>Votos, projetos e gastos de %s (%s), com dados oficiais.</description>" % (escape(p["nome"]), CASA.get(p["casa"], "")),
               "<language>pt-br</language>"]
        for d, t, u, desc in itens[:30]:
            xml.append("<item><title>%s</title><link>%s</link><guid isPermaLink=\"false\">%s</guid><pubDate>%s</pubDate><description>%s</description></item>" % (
                escape(t), escape(u), escape(p["id"] + "|" + t), _data_rss(d), escape(desc[:500])))
        xml.append("</channel></rss>")
        with open(os.path.join(FEEDS, p["id"] + ".xml"), "w", encoding="utf-8") as f:
            f.write("\n".join(xml))


def telegram(pessoas, votacoes, antigas):
    token, canal = os.environ.get("TELEGRAM_TOKEN"), os.environ.get("TELEGRAM_CANAL")
    if not token or not canal:
        return 0
    nomes = {p["id"]: p["nome"] for p in pessoas}
    velhas = {v["id"] for v in antigas or []}
    novas = [v for v in votacoes if v["id"] not in velhas][:8]
    if not novas:
        return 0
    site = endereco_site()
    partes = ["<b>EspiaCE · novas votações</b>"]
    for v in novas:
        sim = [nomes.get(k, k) for k, x in v["votos"].items() if (x or "").lower().startswith("sim")]
        nao = [nomes.get(k, k) for k, x in v["votos"].items() if _voto_txt(x) == "NÃO"]
        selo = ""
        partes.append("\n<b>%s</b> · %s%s\nSim: %s\nNão: %s\n%s" % (CASA.get(v["casa"], ""), escape(v["titulo"][:140]), selo,
                                                              escape(", ".join(sim[:12]) or "ninguém do CE"), escape(", ".join(nao[:12]) or "ninguém do CE"), v.get("url") or ""))
    partes.append("\nVeja tudo: " + site)
    corpo = urllib.parse.urlencode({"chat_id": canal, "text": "\n".join(partes)[:4000], "parse_mode": "HTML", "disable_web_page_preview": "true"}).encode()
    try:
        urllib.request.urlopen(urllib.request.Request("https://api.telegram.org/bot%s/sendMessage" % token, data=corpo), timeout=30).read()
    except Exception as e:  # noqa: BLE001
        print("  Telegram falhou:", e)
        return 0
    return len(novas)


def telegram_radar(pacote, antigo):
    """Avisa no canal quando um projeto do Radar avança de etapa."""
    token, canal = os.environ.get("TELEGRAM_TOKEN"), os.environ.get("TELEGRAM_CANAL")
    if not token or not canal or not pacote:
        return 0
    antes = {i["id"]: i.get("etapa") for i in (antigo or {}).get("itens", [])}
    andou = [i for i in pacote.get("itens", []) if i["id"] not in antes or (i.get("etapa") or 0) > (antes.get(i["id"]) or 0)][:6]
    if not andou:
        return 0
    partes = ["<b>EspiaCE · Radar do Retrocesso</b>"]
    for i in andou:
        partes.append("\n<b>%s %s</b> · %s\n%s\n%s" % (escape(i["tipo"]), escape(i["numero"]), escape(i.get("etapa_txt") or ""), escape(i["ementa"][:200]), i.get("url") or ""))
    partes.append("\nCobre a bancada do Ceará: " + endereco_site() + "#radar")
    corpo = urllib.parse.urlencode({"chat_id": canal, "text": "\n".join(partes)[:4000], "parse_mode": "HTML", "disable_web_page_preview": "true"}).encode()
    try:
        urllib.request.urlopen(urllib.request.Request("https://api.telegram.org/bot%s/sendMessage" % token, data=corpo), timeout=30).read()
    except Exception as e:  # noqa: BLE001
        print("  Telegram (radar) falhou:", e)
        return 0
    return len(andou)


def canal_publico():
    c = os.environ.get("TELEGRAM_CANAL", "")
    return ("https://t.me/" + c.lstrip("@")) if c.startswith("@") else None


if __name__ == "__main__":
    print(json.dumps({"site": endereco_site()}))
