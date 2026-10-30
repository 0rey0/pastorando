"""Roda todos os robôs, calcula a Régua e grava os arquivos que o site lê (site/dados/).

Se uma fonte falhar, os dados anteriores dela são mantidos e o problema aparece em meta.json.
Uso: python coleta/rodar.py
"""
import os
import sys
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import alece  # noqa: E402
import camara  # noqa: E402
import regua  # noqa: E402
import senado  # noqa: E402
from comum import agora, ler, salvar  # noqa: E402

FONTES = [
    ("camara", "Câmara dos Deputados (API de dados abertos)", camara),
    ("senado", "Senado Federal (API de dados abertos e CEAPS)", senado),
    ("alece", "Assembleia Legislativa do Ceará (Verba de Desempenho Parlamentar)", alece),
]


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
    resumo = regua.calcular(pessoas, votacoes)
    votacoes.sort(key=lambda v: v.get("data") or "", reverse=True)
    salvar("parlamentares.json", pessoas)
    salvar("votacoes.json", votacoes)
    salvar("meta.json", {"atualizado": agora(), "fontes": status, "regua": resumo})
    print("\nPronto: %d parlamentares, %d votações." % (len(pessoas), len(votacoes)))
    return 0 if any(s["ok"] for s in status.values()) else 1


if __name__ == "__main__":
    sys.exit(principal())
