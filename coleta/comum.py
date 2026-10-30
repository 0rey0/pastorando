"""Funções comuns aos robôs de coleta. Só usa a biblioteca padrão do Python."""
import csv
import datetime
import io
import json
import os
import re
import shutil
import tempfile
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zipfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "site", "dados")
CONFIG = os.path.join(RAIZ, "config")
FOTOS = os.path.join(RAIZ, "site", "fotos")
CACHE = os.path.join(RAIZ, "cache")
UA = "EspiaCE/1.0 (plataforma civica de transparencia; github.com)"

# Em testes, este dicionário substitui a internet: {url_sem_parametros: caminho_do_arquivo}
FALSO = {}


DIAG = {}  # anotações para descobrir problemas; vão para meta.json


def get(url, params=None, tipo="json", tentativas=4, aceitar="application/json", cabecalhos=None, timeout=90):
    """Baixa uma URL com novas tentativas. tipo='json' devolve objeto; 'bytes' devolve bytes."""
    if params:
        url = url + ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    if FALSO:
        caminho = _fixture(url)
        if not caminho:
            raise FileNotFoundError("sem fixture para " + url)
        with open(caminho, "rb") as f:
            bruto = f.read()
        return json.loads(bruto.decode("utf-8")) if tipo == "json" else bruto
    ultimo = None
    for i in range(tentativas):
        try:
            h = {"User-Agent": UA, "Accept": aceitar}
            h.update(cabecalhos or {})
            req = urllib.request.Request(url, headers=h)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                bruto = r.read()
            if tipo == "json":
                return json.loads(bruto.decode("utf-8"))
            return bruto
        except urllib.error.HTTPError as e:
            ultimo = e
            if e.code in (400, 401, 403, 404, 410):
                break  # não adianta tentar de novo
            time.sleep(2 * (i + 1))
        except Exception as e:  # noqa: BLE001 - qualquer falha de rede vira nova tentativa
            ultimo = e
            time.sleep(2 * (i + 1))
    raise ultimo


def _fixture(url):
    chave = url.split("?")[0]
    for k, caminho in FALSO.items():
        if k.startswith("re:"):
            if re.search(k[3:], url):
                return caminho
        elif chave.endswith(k) or k == url:
            return caminho
    return None


def baixar(url, nome=None, dias=0):
    """Baixa um arquivo grande direto para o disco (pasta cache/) e devolve o caminho.

    dias > 0 reaproveita o arquivo se ele tiver menos de 'dias' dias.
    """
    if FALSO:
        c = _fixture(url)
        if not c:
            raise FileNotFoundError("sem fixture para " + url)
        return c
    os.makedirs(CACHE, exist_ok=True)
    destino = os.path.join(CACHE, nome or slug(url.split("?")[0])[-90:])
    if dias and os.path.exists(destino) and time.time() - os.path.getmtime(destino) < dias * 86400:
        return destino
    ultimo = None
    for i in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(req, timeout=300) as r, tempfile.NamedTemporaryFile(dir=CACHE, delete=False) as f:
                shutil.copyfileobj(r, f, 1 << 20)
            os.replace(f.name, destino)
            return destino
        except urllib.error.HTTPError as e:
            ultimo = e
            if e.code in (403, 404, 410):
                break
            time.sleep(5 * (i + 1))
        except Exception as e:  # noqa: BLE001
            ultimo = e
            time.sleep(5 * (i + 1))
    raise ultimo


def membros_zip(caminho, *contem):
    """Nomes dos arquivos dentro de um zip cujo nome contém todos os trechos pedidos (sem diferenciar maiúsculas)."""
    with zipfile.ZipFile(caminho) as z:
        return [n for n in z.namelist() if all(c.lower() in n.lower() for c in contem)]


def ler_zip(caminho, membro):
    with zipfile.ZipFile(caminho) as z:
        return z.read(membro)


def linhas_csv_zip(caminho, *contem, filtro=None):
    """Lê, em fluxo, os CSVs de um zip (TSE, Câmara, Portal). Devolve (cabecalho, gerador de linhas).

    filtro(linha_texto) -> bool permite descartar linhas cedo, sem montar listas enormes.
    """
    nomes = [n for n in membros_zip(caminho, *contem) if n.lower().endswith((".csv", ".txt"))]
    if not nomes:
        raise FileNotFoundError("nenhum CSV com %s em %s" % (contem, caminho))

    def gerador():
        for nome in nomes:
            with zipfile.ZipFile(caminho) as z, z.open(nome) as f:
                bruto = f.read(4096)
                cod = "utf-8-sig"
                try:
                    bruto.decode("utf-8")
                except UnicodeDecodeError:
                    cod = "latin-1"
            with zipfile.ZipFile(caminho) as z, z.open(nome) as f:
                texto = io.TextIOWrapper(f, encoding=cod, errors="replace", newline="")
                primeira = texto.readline()
                sep = ";" if primeira.count(";") >= primeira.count(",") else ","
                cab = next(csv.reader([primeira], delimiter=sep))
                yield ("__cab__", cab)
                for linha in texto:
                    if filtro and not filtro(linha):
                        continue
                    for l in csv.reader([linha], delimiter=sep):
                        yield (cab, l)
    return gerador()


def tabela_zip(caminho, *contem, filtro=None):
    """Como linhas_csv_zip, mas devolve lista de dicionários {coluna: valor}."""
    out = []
    for cab, l in linhas_csv_zip(caminho, *contem, filtro=filtro):
        if cab == "__cab__":
            continue
        out.append(dict(zip(cab, l)))
    return out


PALAVRAS_VAZIAS = {"de", "da", "do", "das", "dos", "e", "dep", "deputado", "deputada", "dr", "dra", "doutor", "doutora", "pastor", "pastora",
                   "professor", "professora", "prof", "delegado", "delegada", "capitao", "sargento", "cel", "coronel", "senador", "senadora",
                   "irmao", "irma", "padre", "missionario", "general", "tenente", "cabo", "soldado", "major", "enfermeira", "enfermeiro"}


def fichas(nome):
    return {t for t in re.findall(r"[a-z0-9]+", norm(nome)) if t not in PALAVRAS_VAZIAS and len(t) > 1}


def semelhanca(a, b):
    """0 a 1: quão parecidos são dois nomes de político (ignora títulos como Dr., Pastor, Delegado)."""
    if norm(a) == norm(b):
        return 1.0
    fa, fb = fichas(a), fichas(b)
    if not fa or not fb:
        return 0.0
    comum_ = len(fa & fb)
    if comum_ == min(len(fa), len(fb)) and comum_ >= 2:
        return 0.9
    if comum_ == min(len(fa), len(fb)) == 1 and len(fa) == len(fb) == 1:
        return 0.85
    return comum_ / len(fa | fb)


def casar_nome(nome, candidatos, chave=lambda c: c, minimo=0.6):
    """Escolhe, numa lista, o item cujo nome mais se parece com 'nome'. Devolve (item, nota) ou (None, 0)."""
    melhor, nota = None, 0.0
    for c in candidatos:
        nomes = chave(c)
        for n in (nomes if isinstance(nomes, (list, tuple)) else [nomes]):
            s = semelhanca(nome, n)
            if s > nota:
                melhor, nota = c, s
    return (melhor, nota) if nota >= minimo else (None, 0.0)


def salvar_foto(bruto, pid, lado=320):
    """Grava a foto em site/fotos/{pid}.jpg (quadrada, leve). Devolve o caminho relativo ao site ou None."""
    if not bruto:
        return None
    os.makedirs(FOTOS, exist_ok=True)
    destino = os.path.join(FOTOS, pid + ".jpg")
    try:
        from PIL import Image  # Pillow; se não estiver instalado, grava o original
        im = Image.open(io.BytesIO(bruto)).convert("RGB")
        w, h = im.size
        m = min(w, h)
        topo = max(0, int((h - m) * 0.25))  # fotos 3x4: corta mais embaixo que em cima
        im = im.crop(((w - m) // 2, topo, (w - m) // 2 + m, topo + m)).resize((lado, lado))
        im.save(destino, "JPEG", quality=82, optimize=True)
    except ImportError:
        with open(destino, "wb") as f:
            f.write(bruto)
    except Exception as e:  # noqa: BLE001
        print("  foto inválida para", pid, e)
        return None
    return "fotos/%s.jpg" % pid


def foto_existente(pid):
    return "fotos/%s.jpg" % pid if os.path.exists(os.path.join(FOTOS, pid + ".jpg")) else None


def fonte(nome, url):
    return {"n": nome, "u": url}


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
    """Índice da coluna pelo nome: primeiro nome igual, depois começando com, depois contendo."""
    cab = [norm(c).strip('"') for c in cabecalho]
    for op in opcoes:
        for teste in (lambda c: c == op, lambda c: c.startswith(op), lambda c: op in c):
            for i, c in enumerate(cab):
                if teste(c):
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
