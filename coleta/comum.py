"""Funções comuns aos robôs de coleta. Só usa a biblioteca padrão do Python."""
import csv
import datetime
import io
import json
import os
import re
import time
import unicodedata
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "site", "dados")
CONFIG = os.path.join(RAIZ, "config")
UA = "Pastorando/1.0 (plataforma civica de transparencia; github.com)"

# Em testes, este dicionário substitui a internet: {url_sem_parametros: caminho_do_arquivo}
FALSO = {}


def get(url, params=None, tipo="json", tentativas=4, aceitar="application/json"):
    """Baixa uma URL com novas tentativas. tipo='json' devolve objeto; 'bytes' devolve bytes."""
    if params:
        url = url + ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    if FALSO:
        chave = url.split("?")[0]
        for k, caminho in FALSO.items():
            if chave.endswith(k) or k == url:
                with open(caminho, "rb") as f:
                    bruto = f.read()
                return json.loads(bruto.decode("utf-8")) if tipo == "json" else bruto
        raise FileNotFoundError("sem fixture para " + url)
    ultimo = None
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": aceitar})
            with urllib.request.urlopen(req, timeout=90) as r:
                bruto = r.read()
            if tipo == "json":
                return json.loads(bruto.decode("utf-8"))
            return bruto
        except Exception as e:  # noqa: BLE001 - qualquer falha de rede vira nova tentativa
            ultimo = e
            time.sleep(2 * (i + 1))
    raise ultimo


def salvar(nome, obj):
    os.makedirs(DADOS, exist_ok=True)
    caminho = os.path.join(DADOS, nome)
    tmp = caminho + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, caminho)


def ler(nome, padrao=None):
    caminho = os.path.join(DADOS, nome)
    if not os.path.exists(caminho):
        return padrao
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def config(nome):
    with open(os.path.join(CONFIG, nome), encoding="utf-8") as f:
        return json.load(f)


def agora():
    return datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).strftime("%Y-%m-%dT%H:%M")


def norm(s):
    s = unicodedata.normalize("NFD", str(s or "")).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"\s+", " ", s.lower()).strip()


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", norm(s)).strip("-")


def numero_br(v):
    """'1.234,56' ou '1234.56' ou 1234.56 -> float."""
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v or "").strip().replace("R$", "").replace(" ", "")
    if not s:
        return 0.0
    if "," in s:
        s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


_TEMAS = None


def _temas():
    global _TEMAS
    if _TEMAS is None:
        _TEMAS = config("temas.json")
    return _TEMAS


def classificar(texto):
    t = " " + norm(texto) + " "
    achados = []
    for chave, tema in _temas()["temas"].items():
        for p in tema["palavras"]:
            if p in t:
                achados.append(chave)
                break
    return achados


def homenagem(texto):
    t = norm(texto)
    return any(p in t for p in _temas()["homenagem"])


def ler_csv(bruto):
    """Lê CSV brasileiro (UTF-8 ou Latin-1, ';' ou ','). Devolve lista de linhas (listas)."""
    for cod in ("utf-8-sig", "latin-1"):
        try:
            texto = bruto.decode(cod)
            break
        except UnicodeDecodeError:
            continue
    amostra = texto[:4000]
    sep = ";" if amostra.count(";") > amostra.count(",") else ","
    return list(csv.reader(io.StringIO(texto), delimiter=sep))


def achar_coluna(cabecalho, *opcoes):
    cab = [norm(c) for c in cabecalho]
    for op in opcoes:
        for i, c in enumerate(cab):
            if op in c:
                return i
    return None


def resumir_gastos(itens):
    """itens: [{mes, categoria, fornecedor, cnpj, valor, url}] -> resumo para o site."""
    total = sum(i["valor"] for i in itens)
    por_mes, por_cat, por_forn = {}, {}, {}
    for i in itens:
        por_mes[i["mes"]] = por_mes.get(i["mes"], 0) + i["valor"]
        por_cat[i["categoria"]] = por_cat.get(i["categoria"], 0) + i["valor"]
        k = (i["fornecedor"] or "?", i.get("cnpj") or "")
        por_forn[k] = por_forn.get(k, 0) + i["valor"]
    forn = sorted(por_forn.items(), key=lambda kv: -kv[1])
    maior = forn[0][1] / total if forn and total else 0
    return {
        "total": round(total, 2),
        "meses": sorted(por_mes),
        "por_mes": {str(k): round(v, 2) for k, v in sorted(por_mes.items())},
        "por_categoria": [[k, round(v, 2)] for k, v in sorted(por_cat.items(), key=lambda kv: -kv[1])],
        "fornecedores": [[k[0], k[1], round(v, 2)] for k, v in forn[:10]],
        "maior_fornecedor_pct": round(100 * maior, 1),
        "ultimos": sorted(itens, key=lambda i: (i["mes"], i["valor"]), reverse=True)[:15],
        "n": len(itens),
    }
