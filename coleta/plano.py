"""Contra-atacar: onde a direita e a extrema-direita foram mais votadas no Ceará em 2026, por zona eleitoral e por bairro.

Fonte: TSE, dados abertos dos resultados de 2026
  - votacao_candidato_munzona: votos de cada candidato por município e zona eleitoral (todos os cargos, 1º e 2º turno);
  - votacao_secao (CE): votos por seção, para somar por local de votação;
  - eleitorado_local_votacao: endereço e bairro de cada local de votação.
A classificação dos partidos (extrema-direita, direita, centro, esquerda) é editorial e fica aberta em config/espectro.json.
"""
import re
import time

from comum import DIAG, agora, baixar, config, fonte, ler, norm, numero_br, salvar
from tse import CDN, PAGINA, _v, arquivo, tabela  # noqa: F401

ANO = 2026
SECAO = CDN + "/votacao_secao/votacao_secao_{a}_CE.zip"
LOCAIS = CDN + "/eleitorado_locais_votacao/eleitorado_local_votacao_{a}.zip"
DIAS = 20
VERSAO = 4


def _espectro(cfg):
    por_sigla = {}
    for grupo, siglas in cfg["partidos"].items():
        for s in siglas:
            por_sigla[norm(s).replace(" ", "")] = grupo
    return por_sigla


def _grupo(sigla, por_sigla):
    return por_sigla.get(norm(sigla or "").replace(" ", ""), "outros")


def _pct(a, b):
    return round(100.0 * a / b, 1) if b else None


def _zonas(cfg, por_sigla, caminho=None):
    """Soma, por zona eleitoral, os votos de cada campo político em cada cargo."""
    c = caminho or arquivo("votos", ANO)
    if not c:
        return None, {}
    zonas, partido_num, cand_ed = {}, {}, {}
    # o voto para presidente fica no arquivo do Brasil (_BR), não no do Ceará
    for d in tabela(c, r"votacao_candidato_munzona_%d_(CE|BR)\.(csv|txt)$" % ANO, filtro=lambda t: "CE" in t):
        if _v(d, "SG_UF") and _v(d, "SG_UF") != "CE":
            continue
        cargo = norm(_v(d, "DS_CARGO"))
        if cargo not in ("presidente", "governador", "senador", "deputado federal", "deputado estadual"):
            continue
        turno = int(numero_br(_v(d, "NR_TURNO") or 1))
        mun = _v(d, "NM_MUNICIPIO").title()
        zona = str(int(numero_br(_v(d, "NR_ZONA") or 0)))
        sig = _v(d, "SG_PARTIDO")
        q = int(numero_br(_v(d, "QT_VOTOS_NOMINAIS_VALIDOS", "QT_VOTOS_NOMINAIS", "QT_VOTOS")))
        g = _grupo(sig, por_sigla)
        z = zonas.setdefault((mun, zona), {"municipio": mun, "zona": zona, "cargos": {}})
        k = "%s_%d" % (cargo.replace(" ", "_"), turno)
        cg = z["cargos"].setdefault(k, {"total": 0})
        cg["total"] += q
        cg[g] = cg.get(g, 0) + q
        nr = _v(d, "NR_CANDIDATO")
        if nr and sig:
            partido_num[nr[:2]] = sig
        if g in ("extrema_direita", "direita") and cargo in ("deputado federal", "deputado estadual"):
            nome = _v(d, "NM_URNA_CANDIDATO", "NM_CANDIDATO").title()
            cand_ed.setdefault((mun, zona), {}).setdefault((nome, sig, cargo), 0)
            cand_ed[(mun, zona)][(nome, sig, cargo)] += q
    for chave, z in zonas.items():
        top = sorted(cand_ed.get(chave, {}).items(), key=lambda kv: -kv[1])[:5]
        z["mais_votados_direita"] = [{"nome": n, "partido": s, "cargo": c.title(), "votos": v} for (n, s, c), v in top]
    return zonas, partido_num


def _indicadores(z):
    """Os números de cada zona que o site mostra."""
    cg = z["cargos"]
    out = {"municipio": z["municipio"], "zona": z["zona"], "mais_votados_direita": z.get("mais_votados_direita", [])}
    p2 = cg.get("presidente_2")
    p1 = cg.get("presidente_1")
    if p2:
        out["pres2_extrema"] = _pct(p2.get("extrema_direita", 0), p2["total"])
        out["eleitores_votaram"] = p2["total"]
    if p1:
        out["pres1_extrema"] = _pct(p1.get("extrema_direita", 0), p1["total"])
        out["pres1_direita"] = _pct(p1.get("extrema_direita", 0) + p1.get("direita", 0), p1["total"])
        out.setdefault("eleitores_votaram", p1["total"])
    for cargo, rot in (("deputado_federal_1", "dep_fed"), ("deputado_estadual_1", "dep_est"), ("governador_1", "gov1"), ("senador_1", "sen")):
        x = cg.get(cargo)
        if x and x["total"]:
            out[rot + "_extrema"] = _pct(x.get("extrema_direita", 0), x["total"])
            out[rot + "_direita"] = _pct(x.get("extrema_direita", 0) + x.get("direita", 0), x["total"])
    # força da extrema-direita: o 2º turno presidencial quando houver; senão, a média do que existir
    base = [out.get(k) for k in ("pres2_extrema",) if out.get(k) is not None] or \
           [out.get(k) for k in ("pres1_extrema", "dep_fed_extrema", "dep_est_extrema") if out.get(k) is not None]
    out["forca"] = round(sum(base) / len(base), 1) if base else None
    return out


def _bairros(por_sigla, partido_num, cfg):
    """Por local de votação (e bairro): % da extrema-direita. O arquivo do Ceará por seção não traz presidente
    (ele fica no arquivo do Brasil inteiro, grande demais), então a medida é o voto em deputados federais e estaduais
    de partidos de extrema-direita, somando a votação nominal e a de legenda."""
    try:
        c = baixar(SECAO.format(a=ANO), "tse_secao_%d_CE.zip" % ANO, dias=DIAS)
    except Exception as e:  # noqa: BLE001
        DIAG["plano_secao"] = str(e)[:200]
        print("  TSE: votos por seção indisponíveis:", e)
        return []
    locais = {}
    turno_max = 1
    dg = DIAG.setdefault("plano_secao_info", {"arquivos": [], "linhas": 0, "presidente": 0, "cargos": {}})
    try:
        import zipfile
        with zipfile.ZipFile(c) as z:
            dg["arquivos"] = z.namelist()[:6]
    except Exception as e:  # noqa: BLE001
        dg["arquivos"] = ["erro: %s" % e]
    for d in tabela(c, r"votacao_secao_%d_CE\.(csv|txt)$" % ANO):
        dg["linhas"] += 1
        cg = norm(_v(d, "DS_CARGO"))
        if len(dg["cargos"]) < 12:
            dg["cargos"][cg] = dg["cargos"].get(cg, 0) + 1
        if cg not in ("presidente", "deputado federal", "deputado estadual"):
            continue
        if cg == "presidente":
            dg["presidente"] += 1
        turno = int(numero_br(_v(d, "NR_TURNO") or 1))
        if cg == "presidente":
            turno_max = max(turno_max, turno)
        mun = _v(d, "NM_MUNICIPIO").title()
        zona = str(int(numero_br(_v(d, "NR_ZONA") or 0)))
        loc = _v(d, "NR_LOCAL_VOTACAO")
        nr = _v(d, "NR_VOTAVEL")
        q = int(numero_br(_v(d, "QT_VOTOS") or 0))
        if not nr or nr[:2] in ("95", "96", "97"):  # branco, nulo, anulado
            continue
        g = _grupo(partido_num.get(nr[:2], ""), por_sigla)  # os dois primeiros números são o partido
        k = (mun, zona, loc)
        x = locais.setdefault(k, {"nome": _v(d, "NM_LOCAL_VOTACAO").title(), "endereco": _v(d, "DS_LOCAL_VOTACAO_ENDERECO").title(), "t": {}})
        tt = x["t"].setdefault(("p%d" % turno) if cg == "presidente" else "dep", {"total": 0})
        tt["total"] += q
        tt[g] = tt.get(g, 0) + q
    if not locais:
        return []
    bairro, coord = {}, {}
    try:
        cl = baixar(LOCAIS.format(a=ANO), "tse_locais_%d.zip" % ANO, dias=DIAS)
        for d in tabela(cl, r"eleitorado_local_votacao_%d\.(csv|txt)$" % ANO, filtro=lambda t: '"CE"' in t or ";CE;" in t or t.startswith("CE;")):
            if _v(d, "SG_UF") != "CE":
                continue
            k = (_v(d, "NM_MUNICIPIO").title(), str(int(numero_br(_v(d, "NR_ZONA") or 0))), _v(d, "NR_LOCAL_VOTACAO"))
            bairro[k] = _v(d, "NM_BAIRRO").title()
            try:
                lat, lon = float(_v(d, "NR_LATITUDE").replace(",", ".")), float(_v(d, "NR_LONGITUDE").replace(",", "."))
                if -8.5 < lat < -2.5 and -41.5 < lon < -37:  # dentro do Ceará
                    coord[k] = (round(lat, 5), round(lon, 5))
            except (TypeError, ValueError):
                pass
    except Exception as e:  # noqa: BLE001
        DIAG["plano_locais"] = str(e)[:200]
        print("  TSE: bairros dos locais de votação indisponíveis:", e)
    out = []
    medida = "p%d" % turno_max if any(("p%d" % turno_max) in x["t"] for x in locais.values()) else "dep"
    DIAG["plano_medida_locais"] = medida
    for (mun, zona, loc), x in locais.items():
        t = x["t"].get(medida) or {}
        if not t.get("total"):
            continue
        c = coord.get((mun, zona, loc))
        b = bairro.get((mun, zona, loc), "")
        if c and mun == "Fortaleza":  # em Fortaleza, o bairro oficial vem do mapa da prefeitura
            b = _bairro_fortaleza(c[0], c[1]) or b
        out.append({"municipio": mun, "zona": zona, "local": x["nome"], "endereco": x["endereco"], "bairro": b,
                    "lat": c[0] if c else None, "lon": c[1] if c else None,
                    "votos": t["total"], "extrema": _pct(t.get("extrema_direita", 0), t["total"]), "medida": medida})
    DIAG["plano_locais_com_coordenada"] = sum(1 for l in out if l["lat"])
    return out


_BF = {}


def _bairro_fortaleza(lat, lon):
    """Em qual bairro de Fortaleza fica o ponto (limites da Prefeitura, em site/bairros-fortaleza.json)."""
    if "f" not in _BF:
        try:
            import json
            import os
            from comum import RAIZ
            with open(os.path.join(RAIZ, "site", "bairros-fortaleza.json"), encoding="utf-8") as f:
                _BF["f"] = [(x["properties"]["nome"], x["geometry"]["coordinates"]) for x in json.load(f)["features"]]
        except Exception:  # noqa: BLE001
            _BF["f"] = []
    for nome, polys in _BF["f"]:
        for poly in polys:
            if _dentro(lon, lat, poly[0]) and not any(_dentro(lon, lat, buraco) for buraco in poly[1:]):
                return nome
    return None


def _dentro(x, y, anel):
    dentro, j = False, len(anel) - 1
    for i in range(len(anel)):
        xi, yi = anel[i][0], anel[i][1]
        xj, yj = anel[j][0], anel[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi:
            dentro = not dentro
        j = i
    return dentro


def _agrupa_bairros(locais):
    por = {}
    for l in locais:
        if not l["bairro"]:
            continue
        b = por.setdefault((l["municipio"], l["bairro"]), {"municipio": l["municipio"], "bairro": l["bairro"], "votos": 0, "ext": 0.0, "locais": 0, "zonas": set()})
        b["votos"] += l["votos"]
        b["ext"] += l["votos"] * (l["extrema"] or 0) / 100.0
        b["locais"] += 1
        b["zonas"].add(l["zona"])
    out = []
    for b in por.values():
        out.append({"municipio": b["municipio"], "bairro": b["bairro"], "votos": b["votos"], "extrema": _pct(b["ext"], b["votos"]),
                    "locais": b["locais"], "zonas": sorted(b["zonas"], key=lambda z: int(z) if z.isdigit() else 0)})
    return out


def coletar(forcar=False):
    velho = ler("plano.json", {}) or {}
    if not forcar and velho.get("zonas") and velho.get("versao") == VERSAO and velho.get("medida") == "pres2_extrema" and velho.get("bairros") \
            and velho.get("epoch", 0) > time.time() - DIAS * 86400:
        print("Contra-atacar: usando o cálculo guardado de", velho.get("quando"))
        return velho
    cfg = config("espectro.json")
    por_sigla = _espectro(cfg)
    zonas, partido_num = _zonas(cfg, por_sigla)
    if zonas and not any("presidente_2" in z["cargos"] for z in zonas.values()):
        # o arquivo guardado pode ser de antes da apuração do 2º turno: baixa de novo
        try:
            novo = baixar(CDN + "/votacao_candidato_munzona/votacao_candidato_munzona_%d.zip" % ANO, "tse_votos_%d.zip" % ANO, dias=1)
            z2, p2 = _zonas(cfg, por_sigla, novo)
            if z2:
                zonas, partido_num = z2, p2
        except Exception as e:  # noqa: BLE001
            DIAG["plano_2turno"] = str(e)[:160]
        DIAG["plano_tem_2turno"] = any("presidente_2" in z["cargos"] for z in zonas.values())
    if not zonas:
        print("Contra-atacar: votos de %d por zona ainda não estão no TSE" % ANO)
        return velho or None
    lista = [_indicadores(z) for z in zonas.values()]
    lista = [z for z in lista if z.get("forca") is not None]
    lista.sort(key=lambda z: -z["forca"])
    # por município (média ponderada pelos votos)
    mun = {}
    for z in lista:
        m = mun.setdefault(z["municipio"], {"votos": 0, "ext": 0.0, "zonas": 0})
        v = z.get("eleitores_votaram") or 0
        m["votos"] += v
        m["ext"] += v * z["forca"] / 100.0
        m["zonas"] += 1
    municipios = {n: {"forca": _pct(m["ext"], m["votos"]), "votos": m["votos"], "zonas": m["zonas"]} for n, m in mun.items()}
    locais = _bairros(por_sigla, partido_num, cfg)
    medida_locais = (locais[0]["medida"] if locais else None)
    bairros = _agrupa_bairros(locais)
    tem_2t = any(z.get("pres2_extrema") is not None for z in lista)
    pacote = {"versao": VERSAO, "quando": agora(), "epoch": int(time.time()), "ano": ANO, "medida": "pres2_extrema" if tem_2t else "media_1t",
              "medida_locais": {"p2": "pres2", "p1": "pres1", "dep": "deputados"}.get(medida_locais),
              "explica": cfg.get("_leia", ""), "partidos": cfg["partidos"], "zonas": lista, "municipios": municipios,
              "bairros": sorted([b for b in bairros if b["votos"] >= 300], key=lambda b: -(b["extrema"] or 0))[:400],
              "locais": sorted([l for l in locais if l["votos"] >= 150], key=lambda l: -(l["extrema"] or 0))[:300],
              # todos os locais com coordenada, para o mapa: [cidade, zona, local, bairro, lat, lon, votos, % extrema-direita]
              "pontos": [[l["municipio"], l["zona"], l["local"], l["bairro"], l["lat"], l["lon"], l["votos"], l["extrema"]] for l in locais if l["lat"]],
              "fontes": {"zonas": fonte("TSE · votação por município e zona %d" % ANO, PAGINA["resultados"].format(a=ANO)),
                         "secao": fonte("TSE · votação por seção %d (CE)" % ANO, SECAO.format(a=ANO)),
                         "locais": fonte("TSE · locais de votação %d" % ANO, LOCAIS.format(a=ANO)),
                         "zonas_ce": fonte("TRE-CE · endereços dos cartórios e zonas eleitorais", "https://www.tre-ce.jus.br/eleitor/zonas-eleitorais")}}
    salvar("plano.json", pacote)
    print("Contra-atacar: %d zonas, %d bairros, %d locais de votação" % (len(lista), len(pacote["bairros"]), len(pacote["locais"])))
    return pacote
