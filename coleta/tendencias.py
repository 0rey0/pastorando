"""Google Trends: o que as pessoas estão buscando sobre a extrema-direita.

O Google Trends não tem API aberta. O robô usa duas coisas públicas:
  - o RSS das buscas em alta no Brasil (trends.google.com/trending/rss?geo=BR), filtrado pelos termos da extrema-direita;
  - as "pesquisas relacionadas" dos termos de config/tendencias.json, pelo mesmo endereço que a página do Google Trends usa.
O Google às vezes bloqueia os servidores do GitHub (erro 429). Aí o robô guarda o que já tinha, e o site mostra
os gráficos oficiais do Google Trends (incorporados), que funcionam no navegador de quem visita.
"""
import email.utils
import json
import time
import urllib.parse
import xml.etree.ElementTree as ET

from comum import DIAG, agora, config, fonte, get, ler, norm, salvar

RSS = "https://trends.google.com/trending/rss"
EXPLORE = "https://trends.google.com/trends/api/explore"
RELACIONADAS = "https://trends.google.com/trends/api/widgetdata/relatedsearches"
NS = {"ht": "https://trends.google.com/trending/rss"}


def _json_google(bruto):
    t = bruto.decode("utf-8", "replace")
    return json.loads(t[t.index("{"):]) if "{" in t else {}


def em_alta(cfg):
    """Buscas em alta no Brasil que tocam nos termos da extrema-direita."""
    termos = [norm(t) for t in cfg.get("filtro_em_alta", [])]
    out = []
    for geo in ("BR",):
        bruto = get(RSS, {"geo": geo}, tipo="bytes", aceitar="application/rss+xml,application/xml,*/*", tentativas=2, timeout=40)
        raiz = ET.fromstring(bruto)
        for it in raiz.iter("item"):
            tit = (it.findtext("title") or "").strip()
            trafego = it.findtext("ht:approx_traffic", default="", namespaces=NS)
            noticias = [(n.findtext("ht:news_item_title", default="", namespaces=NS), n.findtext("ht:news_item_url", default="", namespaces=NS))
                        for n in it.findall("ht:news_item", NS)]
            texto = norm(tit + " " + " ".join(a for a, _ in noticias))
            if not any(t in texto for t in termos):
                continue
            try:
                d = email.utils.parsedate_to_datetime(it.findtext("pubDate") or "").date().isoformat()
            except Exception:  # noqa: BLE001
                d = ""
            out.append({"busca": tit, "trafego": trafego, "data": d, "noticia": (noticias[0] if noticias else ["", ""])[0],
                        "link": (noticias[0] if noticias else ["", ""])[1],
                        "google": "https://trends.google.com/trends/explore?geo=BR&q=" + urllib.parse.quote(tit)})
    return out


def relacionadas(termo, geo, periodo):
    """Pesquisas relacionadas a um termo (as que mais cresceram e as mais buscadas)."""
    req = {"comparisonItem": [{"keyword": termo, "geo": geo, "time": periodo}], "category": 0, "property": ""}
    ex = _json_google(get(EXPLORE, {"hl": "pt-BR", "tz": "180", "req": json.dumps(req)}, tipo="bytes", aceitar="application/json,*/*", tentativas=2, timeout=40))
    w = next((w for w in ex.get("widgets", []) if w.get("id") == "RELATED_QUERIES"), None)
    if not w:
        return None
    dados = _json_google(get(RELACIONADAS, {"hl": "pt-BR", "tz": "180", "req": json.dumps(w["request"]), "token": w["token"]},
                             tipo="bytes", aceitar="application/json,*/*", tentativas=2, timeout=40))
    listas = dados.get("default", {}).get("rankedList", [])
    pega = lambda i: [{"busca": x.get("query"), "valor": x.get("formattedValue")} for x in (listas[i].get("rankedKeyword", []) if len(listas) > i else [])][:10]
    return {"mais": pega(0), "subindo": pega(1)}


def coletar():
    cfg = config("tendencias.json")
    velho = ler("tendencias.json", {}) or {}
    pacote = {"quando": agora(), "epoch": int(time.time()), "termos": cfg["termos"], "periodo": cfg.get("periodo", "today 1-m"),
              "geo": cfg.get("geo", "BR-CE"), "em_alta": velho.get("em_alta", []), "relacionadas": velho.get("relacionadas", {}),
              "fontes": {"google": fonte("Google Trends", "https://trends.google.com/trends/explore?geo=BR-CE&q=" + urllib.parse.quote(",".join(cfg["termos"][:5])))}}
    try:
        novos = em_alta(cfg)
        vistos = {x["busca"] for x in novos}
        pacote["em_alta"] = (novos + [x for x in pacote["em_alta"] if x["busca"] not in vistos])[:40]
    except Exception as e:  # noqa: BLE001
        DIAG["trends_em_alta"] = str(e)[:200]
        print("  Google Trends (em alta) falhou:", e)
    for termo in cfg["termos"]:
        try:
            r = relacionadas(termo, cfg.get("geo", "BR-CE"), cfg.get("periodo", "today 1-m"))
            if r:
                pacote["relacionadas"][termo] = r
            time.sleep(4)
        except Exception as e:  # noqa: BLE001
            DIAG.setdefault("trends_relacionadas", {})[termo] = str(e)[:160]
            print("  Google Trends (%s) falhou: %s" % (termo, e))
            break  # se o Google bloqueou um, bloqueia os outros; fica o que já estava guardado
    salvar("tendencias.json", pacote)
    print("Google Trends: %d buscas em alta ligadas ao tema; %d termos com pesquisas relacionadas" % (len(pacote["em_alta"]), len(pacote["relacionadas"])))
    return pacote
