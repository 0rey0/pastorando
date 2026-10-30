"""Teste de ponta a ponta sem internet.

Cria respostas falsas no mesmo formato das APIs oficiais, roda todos os robôs e confere o resultado.
Uso: python testes/teste_coleta.py   (grava em testes/saida/, não mexe em site/dados)
"""
import json
import os
import random
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(AQUI), "coleta"))
import comum  # noqa: E402

FX = os.path.join(AQUI, "fixtures")
os.makedirs(FX, exist_ok=True)
random.seed(7)


def grava(nome, obj, cod="utf-8"):
    caminho = os.path.join(FX, nome)
    with open(caminho, "wb") as f:
        f.write(obj.encode(cod) if isinstance(obj, str) else json.dumps(obj, ensure_ascii=False).encode("utf-8"))
    return caminho


NOMES = ["Ana Exemplo", "Bruno Teste", "Carla Modelo", "Davi Amostra", "Elisa Ficticia"]
PARTIDOS = ["PA", "PB", "PC", "PD", "PE"]
deps = [{"id": 900 + i, "nome": n, "siglaPartido": PARTIDOS[i], "siglaUf": "CE", "urlFoto": "", "email": "dep%d@exemplo.org" % i} for i, n in enumerate(NOMES)]
EMENTAS = ["Dispõe sobre a segurança pública nas escolas", "Institui o Dia Nacional do Forró", "Amplia o atendimento do SUS no interior",
           "Reduz o imposto sobre a cesta básica", "Denomina viaduto em Fortaleza", "Cria programa de emprego para jovens"]
desp = {"dados": [{"ano": 2026, "mes": m, "tipoDespesa": random.choice(["COMBUSTÍVEIS E LUBRIFICANTES.", "DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR.", "PASSAGEM AÉREA - SIGEPA"]),
                   "nomeFornecedor": random.choice(["POSTO ESTRELA", "AGENCIA SOL", "CIA AEREA X"]), "cnpjCpfFornecedor": "12345678000199",
                   "valorLiquido": round(random.uniform(500, 9000), 2), "urlDocumento": "https://exemplo.org/nota.pdf"} for m in range(1, 10) for _ in range(3)], "links": []}
props = {"dados": [{"id": 5000 + i, "siglaTipo": "PL", "numero": 100 + i, "ano": 2026, "ementa": e} for i, e in enumerate(EMENTAS)], "links": []}
vots = {"dados": [{"id": "77%02d-1" % i, "dataHoraRegistro": "2026-09-%02dT20:00:00" % (i + 1), "siglaOrgao": "PLEN", "proposicaoObjeto": "PL %d/2026" % (900 + i),
                   "descricao": random.choice(["Aprovado projeto que isenta imposto de renda", "Aprovada a PEC da segurança pública", "Rejeitado requerimento"])} for i in range(6)], "links": []}
votos = {"dados": [{"tipoVoto": random.choice(["Sim", "Não", "Sim", "Abstenção"]), "deputado_": {"id": d["id"], "siglaUf": "CE"}} for d in deps[:4]]}

ceaps = "ULTIMA ATUALIZACAO;29/10/2026\nANO;MES;SENADOR;TIPO_DESPESA;CNPJ_CPF;FORNECEDOR;DOCUMENTO;DATA;DETALHAMENTO;VALOR_REEMBOLSADO;COD_DOCUMENTO\n"
for m in range(1, 10):
    for s in ("SENADORA EXEMPLO", "SENADOR TESTE"):
        ceaps += '2026;%d;%s;Passagens aéreas;12345678000199;CIA AEREA X;1;01/%02d/2026;;"%s";1\n' % (m, s, m, ("%.2f" % random.uniform(1000, 20000)).replace(".", ","))
lista_sen = {"ListaParlamentarEmExercicio": {"Parlamentares": {"Parlamentar": [
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "71", "NomeParlamentar": "Senadora Exemplo", "SiglaPartidoParlamentar": "PA", "UfParlamentar": "CE"}},
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "72", "NomeParlamentar": "Senador Teste", "SiglaPartidoParlamentar": "PC", "UfParlamentar": "CE"}},
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "73", "NomeParlamentar": "Senador de Outro Estado", "SiglaPartidoParlamentar": "PB", "UfParlamentar": "SP"}}]}}}
vot_sen = {"VotacaoParlamentar": {"Parlamentar": {"Votacoes": {"Votacao": [
    {"CodigoSessaoVotacao": str(8000 + i), "SessaoPlenaria": {"DataSessao": "2026-08-%02d" % (i + 3)}, "Materia": {"DescricaoIdentificacao": "PL %d/2026" % (300 + i), "Ementa": "Altera regras de saúde"},
     "SiglaDescricaoVoto": random.choice(["Sim", "Não", "MIS"])} for i in range(5)]}}}}
aut_sen = {"MateriasAutoriaParlamentar": {"Parlamentar": {"Autorias": {"Autoria": [
    {"Materia": {"DescricaoIdentificacaoMateria": "PL %d/2026" % (400 + i), "EmentaMateria": e}} for i, e in enumerate(EMENTAS[:4])]}}}}
alece_csv = "NOME;FORNECEDOR;CNPJ;ITEM DE DESPESA;VALOR PAGO\n"
for n in ("DEP JOSE EXEMPLO", "DEP MARIA TESTE", "DEP PEDRO AMOSTRA"):
    for _ in range(4):
        alece_csv += "%s;%s;12.345.678/0001-99;%s;%s\n" % (n, random.choice(["Posto Sol", "Grafica Mar"]), random.choice(["Combustível", "Divulgação"]), ("%.2f" % random.uniform(800, 9000)).replace(".", ","))

import openpyxl  # noqa: E402
for k in range(2):
    wb = openpyxl.Workbook(); ws = wb.active
    ws.append(["Votação nominal - Mensagem %d" % (9000 + k)]); ws.append(["Deputado", "Partido", "Voto"])
    for n, v in (("JOSE EXEMPLO", "SIM"), ("Dep. Maria Teste", "NÃO"), ("PEDRO AMOSTRA", "SIM" if k else "")):
        ws.append([n, "PX", v])
    wb.save(os.path.join(FX, "alece_vot%d.xlsx" % k))
pagina = "<table>" + "".join('<tr><td>31ª</td><td>%02d/07/2026</td><td>Mensagem %d - Reajuste do piso dos professores</td><td><a href="/uploads/votacao_nominal_materia_csv/alece_vot%d.xlsx">Baixar</a></td></tr>' % (10 + k, 9000 + k, k) for k in range(2)) + "</table>"

comum.FALSO = {
    "/consultas-gerais/votacao-nominal": grava("alece_votacao.html", pagina),
    "alece_vot0.xlsx": os.path.join(FX, "alece_vot0.xlsx"),
    "alece_vot1.xlsx": os.path.join(FX, "alece_vot1.xlsx"),
    "/deputados": grava("camara_deputados.json", {"dados": deps, "links": []}),
    "/despesas": grava("camara_despesas.json", desp),
    "/proposicoes": grava("camara_proposicoes.json", props),
    "/votos": grava("camara_votos.json", votos),
    "/votacoes": grava("camara_votacoes.json", vots),
    "/senador/lista/atual.json": grava("senado_lista.json", lista_sen),
    "despesa_ceaps_2026.csv": grava("senado_ceaps.csv", ceaps, "latin-1"),
    "/votacoes.json": grava("senado_votacoes.json", vot_sen),
    "/autorias.json": grava("senado_autorias.json", aut_sen),
    "/verba-desempenho-parlamentar/csv": grava("alece_vdp.csv", alece_csv),
}
comum.DADOS = os.path.join(AQUI, "saida")
import rodar  # noqa: E402

codigo = rodar.principal()
ps = json.load(open(os.path.join(comum.DADOS, "parlamentares.json"), encoding="utf-8"))
vs = json.load(open(os.path.join(comum.DADOS, "votacoes.json"), encoding="utf-8"))
meta = json.load(open(os.path.join(comum.DADOS, "meta.json"), encoding="utf-8"))
casas = {c: [p for p in ps if p["casa"] == c] for c in ("camara", "senado", "alece")}
assert codigo == 0
assert len(casas["camara"]) == 5 and len(casas["senado"]) == 2 and len(casas["alece"]) == 3, {k: len(v) for k, v in casas.items()}
assert all(p.get("regua") and p["regua"]["nota"] is not None for p in ps), "todo mundo precisa de nota"
assert len([v for v in vs if v["casa"] == "alece"]) == 2
assert len({v["id"] for v in vs}) == len(vs), "votações repetidas"
assert any(pr["homenagem"] for pr in casas["camara"][0]["projetos"]), "homenagem não detectada"
assert "seguranca" in casas["camara"][0]["projetos"][0]["temas"]
assert all(f["ok"] for f in meta["fontes"].values()), meta["fontes"]
assert casas["alece"][0]["gastos"]["pct_teto"] is not None
assert sum(d["peso"] for d in meta["regua"]["dimensoes"].values()) in (99, 100, 101)
print("\nTESTE OK")
for p in ps:
    print("  %-8s %-22s nota %3s %s" % (p["casa"], p["nome"], p["regua"]["nota"], "(parcial: " + ", ".join(d["chave"] for d in p["regua"]["dims"]) + ")" if p["regua"]["parcial"] else ""))
print("  votações:", len(vs), "| pesos:", {k: v["peso"] for k, v in meta["regua"]["dimensoes"].items()})
