"""Roda todos os robôs e grava os arquivos que o site lê (site/dados/).

Se uma fonte falhar, os dados anteriores dela são mantidos e o problema aparece em meta.json.
Uso: python coleta/rodar.py
"""
import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import alece  # noqa: E402
import avisos  # noqa: E402
import camara  # noqa: E402
import emendas  # noqa: E402
import governo  # noqa: E402
import municipios  # noqa: E402
import noticias  # noqa: E402
import radar  # noqa: E402
import senado  # noqa: E402
import tse  # noqa: E402
from comum import agora, casar_nome, config, ler, salvar  # noqa: E402

FONTES = [
    ("camara", "Câmara dos Deputados (API de dados abertos)", camara),
    ("senado", "Senado Federal (API de dados abertos e CEAPS)", senado),
    ("alece", "Assembleia Legislativa do Ceará (Portal da Transparência)", alece),
]
NOMES_EXTRA = {
    "tse": "TSE (fotos, partidos, redes sociais, bens, votos, campanha, eleitos de 2026)",
    "alece_projetos": "ALECE (proposições em tramitação)",
    "emendas": "Portal da Transparência (emendas parlamentares)",
    "governo": "Tesouro Nacional, Siconfi (orçamento do estado)",
    "radar": "Radar do Retrocesso (Câmara e ALECE)",
    "municipios": "IBGE Cidades (IDHM, renda, saúde, educação das cidades)",
    "noticias": "Jornais (O Povo, Diário do Nordeste, Folha, Estadão, G1)",
}


def _etapa(status, chave, funcao, *args):
    """Roda uma etapa extra; se falhar, registra o erro e segue."""
    print("\n== " + NOMES_EXTRA[chave])
    try:
        r = funcao(*args)
        status[chave] = {"nome": NOMES_EXTRA[chave], "ok": True, "quando": agora()}
        return r
    except Exception as e:  # noqa: BLE001
        traceback.print_exc()
        status[chave] = {"nome": NOMES_EXTRA[chave], "ok": False, "erro": str(e)[:300], "quando": agora()}
        return None


def promessas(pessoas, gov):
    itens = [x for x in (config("promessas.json").get("itens") or []) if not str(x.get("quem", "")).startswith("EXEMPLO")]
    alvos = list(pessoas) + ([{"id": "governador", "nome": gov["governador"]["nome"]}] if gov and gov.get("governador") else [])
    por = {}
    for x in itens:
        a, _ = casar_nome(x.get("quem", ""), alvos, chave=lambda p: p["nome"], minimo=0.67)
        if a:
            por.setdefault(a["id"], []).append({k: x.get(k) for k in ("promessa", "fonte", "data", "status", "prova_status")})
    for p in pessoas:
        if por.get(p["id"]):
            p["promessas"] = por[p["id"]]
    return por.get("governador", [])


def principal():
    antigas = ler("parlamentares.json", [])
    antigas_v = ler("votacoes.json", [])
    meta_antiga = ler("meta.json", {}) or {}
    pessoas, votacoes, status = [], [], {}
    for chave, nome, mod in FONTES:
        print("\n== " + nome)
        try:
            ps, vs = mod.coletar()
            if not ps:
                raise RuntimeError("nenhum parlamentar retornado")
            pessoas += ps
            votacoes += vs
            status[chave] = {"nome": nome, "ok": True, "quando": agora(), "pessoas": len(ps), "votacoes": len(vs)}
        except Exception as e:  # noqa: BLE001
            traceback.print_exc()
            pessoas += [p for p in antigas if p.get("casa") == chave]
            votacoes += [v for v in antigas_v if v.get("casa") == chave]
            anterior = (meta_antiga.get("fontes") or {}).get(chave, {})
            status[chave] = {"nome": nome, "ok": False, "erro": str(e)[:300], "quando": agora(),
                             "ultimo_sucesso": anterior.get("quando") if anterior.get("ok") else anterior.get("ultimo_sucesso")}
    # TSE: se falhar, usa o último pacote bom
    pacote = _etapa(status, "tse", tse.coletar, pessoas) or ler("tse.json", {}) or {}
    if pacote:
        tse._readicionar(pessoas, pacote)
        tse.aplicar(pessoas, pacote)
    executivo = _etapa(status, "alece_projetos", alece.completar, pessoas) or []
    _etapa(status, "emendas", emendas.coletar, pessoas)
    gov = _etapa(status, "governo", governo.coletar, pacote, executivo, [v for v in votacoes if v["casa"] == "alece"]) or ler("governo.json", {}) or {}
    if gov:
        gov["promessas_manuais"] = promessas(pessoas, gov)
    else:
        promessas(pessoas, gov)
    radar_antigo = ler("radar.json", {}) or {}
    radar_novo = _etapa(status, "radar", radar.coletar, pessoas, votacoes)
    _etapa(status, "municipios", municipios.coletar, pessoas)
    _etapa(status, "noticias", noticias.coletar, pessoas, radar_novo or radar_antigo)
    votacoes.sort(key=lambda v: v.get("data") or "", reverse=True)
    for chave in ("tse", "alece_projetos", "emendas", "governo", "radar", "municipios", "noticias"):
        if not status.get(chave, {}).get("ok"):
            ant = (meta_antiga.get("fontes") or {}).get(chave, {})
            status.setdefault(chave, {"nome": NOMES_EXTRA[chave], "ok": False})["ultimo_sucesso"] = ant.get("quando") if ant.get("ok") else ant.get("ultimo_sucesso")
    try:
        avisos.feeds(pessoas, votacoes)
        enviados = avisos.telegram(pessoas, votacoes, antigas_v) + avisos.telegram_radar(radar_novo, radar_antigo)
        if enviados:
            print("Telegram: %d votações avisadas" % enviados)
    except Exception:  # noqa: BLE001
        traceback.print_exc()
    salvar("parlamentares.json", pessoas)
    salvar("votacoes.json", votacoes)
    if gov:
        salvar("governo.json", gov)
    if pacote:
        salvar("eleicao.json", {"eleitos2026": pacote.get("eleitos2026", []), "governo": pacote.get("governo", {}), "fontes": pacote.get("fontes", {}),
                                "quando": pacote.get("quando")})
    salvar("meta.json", {"atualizado": agora(), "fontes": status, "site": avisos.endereco_site(),
                         "telegram": avisos.canal_publico(), "repositorio": os.environ.get("GITHUB_REPOSITORY")})
    print("\nPronto: %d parlamentares, %d votações." % (len(pessoas), len(votacoes)))
    return 0 if any(s.get("ok") for k, s in status.items() if k in ("camara", "senado", "alece")) else 1


if __name__ == "__main__":
    sys.exit(principal())
