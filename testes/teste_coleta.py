"""Teste de ponta a ponta sem internet.

Cria respostas falsas no mesmo formato das fontes oficiais (APIs, CSVs, ZIPs do TSE, PDFs da ALECE),
roda todos os robôs e confere o resultado.
Uso: python testes/teste_coleta.py   (grava em testes/saida/, não mexe em site/dados)
"""
import datetime
import io
import json
import os
import random
import shutil
import sys
import zipfile

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(AQUI), "coleta"))
import comum  # noqa: E402

FX = os.path.join(AQUI, "fixtures")
SAIDA = os.path.join(AQUI, "saida")
shutil.rmtree(SAIDA, ignore_errors=True)
os.makedirs(FX, exist_ok=True)
random.seed(7)
ANO = datetime.date.today().year
YY = ANO % 100


def grava(nome, obj, cod="utf-8"):
    caminho = os.path.join(FX, nome)
    with open(caminho, "wb") as f:
        if isinstance(obj, bytes):
            f.write(obj)
        elif isinstance(obj, str):
            f.write(obj.encode(cod))
        else:
            f.write(json.dumps(obj, ensure_ascii=False).encode("utf-8"))
    return caminho


def zipa(nome, arquivos):
    caminho = os.path.join(FX, nome)
    with zipfile.ZipFile(caminho, "w", zipfile.ZIP_DEFLATED) as z:
        for n, conteudo in arquivos.items():
            z.writestr(n, conteudo)
    return caminho


def csv_tse(cab, linhas):
    """CSV no padrão do TSE: Latin-1, ponto e vírgula, tudo entre aspas."""
    out = ";".join('"%s"' % c for c in cab) + "\n"
    for l in linhas:
        out += ";".join('"%s"' % c for c in l) + "\n"
    return out.encode("latin-1")


def foto_jpg(cor):
    from PIL import Image
    b = io.BytesIO()
    Image.new("RGB", (161, 225), cor).save(b, "JPEG")
    return b.getvalue()


def pdf(texto):
    caminho_fixo = None
    try:
        from reportlab.pdfgen import canvas
    except ImportError:
        return caminho_fixo
    b = io.BytesIO()
    c = canvas.Canvas(b)
    y = 800
    for linha in texto.split("\n"):
        c.drawString(40, y, linha)
        y -= 16
    c.save()
    return b.getvalue()


# ------------------------------------------------------------------ Câmara
NOMES = ["Ana Exemplo", "Bruno Teste", "Carla Modelo", "Davi Amostra", "Elisa Ficticia"]
PARTIDOS = ["PA", "PB", "PC", "PD", "PE"]
deps = [{"id": 900 + i, "nome": n, "siglaPartido": PARTIDOS[i], "siglaUf": "CE", "urlFoto": "https://www.camara.leg.br/internet/deputado/bandep/%d.jpg" % (900 + i),
         "email": "dep%d@exemplo.org" % i} for i, n in enumerate(NOMES)]
detalhe = {"dados": {"id": 900, "nomeCivil": "ANA EXEMPLO DA SILVA", "cpf": "11111111111", "redeSocial": ["https://www.instagram.com/anaexemplo"],
                     "ultimoStatus": {"situacao": "Exercício", "condicaoEleitoral": "Titular", "gabinete": {"sala": "101", "predio": "4", "telefone": "3215-5101", "email": "dep.ana@camara.leg.br"}}}}
EMENTAS = ["Dispõe sobre a segurança pública nas escolas", "Institui o Dia Nacional do Forró", "Amplia o atendimento do SUS no interior",
           "Garante o piso salarial dos professores da escola pública", "Denomina viaduto em Fortaleza", "Autoriza a privatização da empresa de água"]
desp = {"dados": [{"ano": ANO, "mes": m, "tipoDespesa": random.choice(["COMBUSTÍVEIS E LUBRIFICANTES.", "DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR.", "PASSAGEM AÉREA - SIGEPA"]),
                   "nomeFornecedor": random.choice(["POSTO ESTRELA", "AGENCIA SOL", "CIA AEREA X"]), "cnpjCpfFornecedor": "12345678000199",
                   "valorLiquido": round(random.uniform(500, 9000), 2), "urlDocumento": "https://exemplo.org/nota.pdf"} for m in range(1, 10) for _ in range(3)], "links": []}
props = {"dados": [{"id": 5000 + i, "siglaTipo": "PL", "numero": 100 + i, "ano": ANO, "ementa": e} for i, e in enumerate(EMENTAS)], "links": []}
DESCS = ["Aprovada a isenção do imposto de renda para quem ganha até 5 mil", "Aprovada a privatização da empresa de energia", "Aprovado o piso salarial da enfermagem",
         "Rejeitado requerimento de retirada de pauta", "Aprovado o fim da escala 6x1", "Aprovada a concessão de serviços de saneamento à iniciativa privada"]
vots = {"dados": [{"id": "77%02d-1" % i, "dataHoraRegistro": "%d-09-%02dT20:00:00" % (ANO, i + 1), "siglaOrgao": "PLEN", "proposicaoObjeto": "PL %d/%d" % (900 + i, ANO),
                   "uriProposicaoObjeto": "https://dadosabertos.camara.leg.br/api/v2/proposicoes/%d" % (2400000 + i), "descricao": d, "aprovacao": 1} for i, d in enumerate(DESCS)], "links": []}
votos = {"dados": [{"tipoVoto": v, "deputado_": {"id": d["id"], "siglaUf": "CE"}} for d, v in zip(deps[:4], ["Sim", "Não", "Sim", "Abstenção"])]}
presenca_html = "<html><body><h2>Presença em Plenário</h2><dl><dt>Presenças</dt><dd>40 dias</dd><dt>Ausências justificadas</dt><dd>3 dias</dd><dt>Ausências não justificadas</dt><dd>2 dias</dd></dl></body></html>"
cotas_cab = ["txNomeParlamentar", "cpf", "ideCadastro", "sgUF", "sgPartido", "txtDescricao", "txtFornecedor", "txtCNPJCPF", "datEmissao", "vlrLiquido", "numMes", "txtPassageiro", "txtTrecho", "urlDocumento"]
cotas = ";".join('"%s"' % c for c in cotas_cab) + "\n"
for i, d in enumerate(deps[:3]):
    for k in range(3):
        cotas += ";".join('"%s"' % c for c in [d["nome"].upper(), "", d["id"], "CE", d["siglaPartido"], "PASSAGEM AÉREA - SIGEPA", "CIA AEREA X", "", "%d-%02d-1%dT00:00:00" % (ANO, 8 + k % 2, k),
                                               "1200.50", 8, d["nome"].upper(), "FOR/BSB" if k % 2 == 0 else "BSB/FOR", ""]) + "\n"
cotas += '"FULANO SP";"";"999";"SP";"PX";"PASSAGEM";"CIA";"";"%d-01-01";"10";"1";"FULANO";"GRU/BSB";""\n' % ANO

# ------------------------------------------------------------------ Senado
ceaps = "ULTIMA ATUALIZACAO;29/10/%d\nANO;MES;SENADOR;TIPO_DESPESA;CNPJ_CPF;FORNECEDOR;DOCUMENTO;DATA;DETALHAMENTO;VALOR_REEMBOLSADO;COD_DOCUMENTO\n" % ANO
for m in range(1, 10):
    for s in ("SENADORA EXEMPLO", "SENADOR TESTE"):
        ceaps += '%d;%d;%s;Passagens aéreas, aquáticas e terrestres nacionais;12345678000199;CIA AEREA X;1;0%d/%02d/%d;Companhia Aérea: X, Localizador: ABC123. Passageiro: %s, Voo: FOR/BSB;"%s";1\n' % (
            ANO, m, s, 5, m, ANO, s, ("%.2f" % random.uniform(1000, 20000)).replace(".", ","))
lista_sen = {"ListaParlamentarEmExercicio": {"Parlamentares": {"Parlamentar": [
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "71", "NomeParlamentar": "Senadora Exemplo", "NomeCompletoParlamentar": "Senadora Exemplo de Souza", "SiglaPartidoParlamentar": "PA", "UfParlamentar": "CE", "UrlFotoParlamentar": "https://www.senado.leg.br/senadores/img/fotos-oficiais/senador71.jpg", "EmailParlamentar": "sen.exemplo@senado.leg.br"}},
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "72", "NomeParlamentar": "Senador Teste", "SiglaPartidoParlamentar": "PC", "UfParlamentar": "CE"}},
    {"IdentificacaoParlamentar": {"CodigoParlamentar": "73", "NomeParlamentar": "Senador de Outro Estado", "SiglaPartidoParlamentar": "PB", "UfParlamentar": "SP"}}]}}}
vot_sen = {"VotacaoParlamentar": {"Parlamentar": {"Votacoes": {"Votacao": [
    {"CodigoSessaoVotacao": str(8000 + i), "SessaoPlenaria": {"DataSessao": "%d-08-%02d" % (ANO, i + 3)}, "Materia": {"Codigo": str(150000 + i), "DescricaoIdentificacao": "PL %d/%d" % (300 + i, ANO), "Ementa": e},
     "SiglaDescricaoVoto": v} for i, (e, v) in enumerate([("Amplia o SUS e a atenção básica", "Sim"), ("Autoriza a privatização dos Correios", "Não"), ("Cria o piso salarial nacional", "Sim"), ("Altera regras de pesca", "MIS"), ("Isenção do imposto de renda até 5 mil", "Sim")])]}}}}
aut_sen = {"MateriasAutoriaParlamentar": {"Parlamentar": {"Autorias": {"Autoria": [
    {"Materia": {"CodigoMateria": str(160000 + i), "DescricaoIdentificacaoMateria": "PL %d/%d" % (400 + i, ANO), "EmentaMateria": e}} for i, e in enumerate(EMENTAS[:4])]}}}}

# ------------------------------------------------------------------ ALECE
alece_csv = "NOME;FORNECEDOR;CNPJ;ITEM DE DESPESA;VALOR PAGO\n"
for n in ("DEP JOSE EXEMPLO", "DEP MARIA TESTE", "DEP PEDRO AMOSTRA"):
    for _ in range(4):
        alece_csv += "%s;%s;12.345.678/0001-99;%s;%s\n" % (n, random.choice(["Posto Sol", "Grafica Mar"]), random.choice(["Combustível", "Divulgação"]), ("%.2f" % random.uniform(800, 9000)).replace(".", ","))
import openpyxl  # noqa: E402
for k in range(4):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.append(["Votação nominal - Mensagem %d" % (9000 + k)])
    ws.append(["Deputado", "Partido", "Voto"])
    for n, v in (("JOSE EXEMPLO", "SIM"), ("Dep. Maria Teste", "NÃO" if k != 2 else "SIM"), ("PEDRO AMOSTRA", "SIM" if k else ""), ("LUCAS SECRETARIO", "")):
        ws.append([n, "PX", v])
    wb.save(os.path.join(FX, "alece_vot%d.xlsx" % k))
MATERIAS = ["Reajuste do piso dos professores da rede estadual", "Concessão do saneamento à iniciativa privada", "Programa de moradia popular", "Cria a merenda escolar regionalizada"]
pagina = "<table>" + "".join('<tr><td>31ª</td><td>%02d/07/%d</td><td>Mensagem %d - %s</td><td><a href="/uploads/votacao_nominal_materia_csv/alece_vot%d.xlsx">Baixar</a></td></tr>' % (10 + k, ANO, 9000 + k, MATERIAS[k], k) for k in range(4)) + "</table>"
PROPS = [("pl", 1, "DEPUTADO JOSE EXEMPLO", "INSTITUI O PROGRAMA ESTADUAL DE CRECHE EM TEMPO INTEGRAL NA ESCOLA PUBLICA"),
         ("pl", 2, "DEPUTADA MARIA TESTE", "DENOMINA A AREINHA DO MUNICIPIO DE CRATEUS"),
         ("pl", 3, "PODER EXECUTIVO", "PROJETO DE LEI ORIUNDO DA MENSAGEM 9.500 - DISPOE SOBRE O REAJUSTE DOS SERVIDORES"),
         ("pl", 4, "DEPUTADO PEDRO AMOSTRA, DEPUTADO JOSE EXEMPLO", "AUTORIZA A CONCESSAO DE RODOVIA ESTADUAL A INICIATIVA PRIVADA"),
         ("pi", 1, "DEPUTADA MARIA TESTE", "INDICA A CRIACAO DE RESTAURANTE POPULAR EM SOBRAL"),
         ("pl", 5, "DEPUTADO PEDRO AMOSTRA", "AUTORIZA A PRIVATIZACAO DA COMPANHIA ESTADUAL DE AGUA E ESGOTO")]
pdfs = {}
for tipo, n, autor, ementa in PROPS:
    b = pdf("Nº da proposição\n%05d/%d\nData de autuação\n0%d/03/%d\nAssunto principal: PROPOSIÇÕES\nAutor: %s\n\nEmenta:\n%s\n\nEXMO. SR. PRESIDENTE" % (n, ANO, n, ANO, autor, ementa))
    nome = "alece_%s%d.pdf" % (tipo, n)
    if b:
        grava(nome, b)
    pdfs["tramit%d/%s%d_%02d.pdf" % (ANO, tipo, n, YY)] = os.path.join(FX, nome)

# ------------------------------------------------------------------ TSE
CAB = ["SG_UF", "DS_CARGO", "SQ_CANDIDATO", "NR_CANDIDATO", "NM_CANDIDATO", "NM_URNA_CANDIDATO", "NR_CPF_CANDIDATO", "DS_EMAIL", "SG_PARTIDO", "DS_SIT_TOT_TURNO", "NR_TURNO",
       "DS_OCUPACAO", "DS_GRAU_INSTRUCAO", "DS_GENERO", "DS_COR_RACA", "DT_NASCIMENTO", "NM_MUNICIPIO_NASCIMENTO"]


def cand(cargo, sq, nr, nome, urna, cpf, partido, sit, turno=1):
    return ["CE", cargo, sq, nr, nome, urna, cpf, "#NULO#", partido, sit, turno, "PROFESSOR", "SUPERIOR COMPLETO", "FEMININO", "PARDA", "01/01/1970", "FORTALEZA"]


c22 = [cand("DEPUTADO FEDERAL", "60001", "1301", "ANA EXEMPLO DA SILVA", "ANA EXEMPLO", "11111111111", "PA", "ELEITO POR QP"),
       cand("DEPUTADO FEDERAL", "60002", "2201", "BRUNO DE TAL TESTE", "BRUNO TESTE", "-4", "PB", "ELEITO POR MÉDIA"),
       cand("DEPUTADO ESTADUAL", "60011", "13111", "JOSE EXEMPLO FILHO", "DR. JOSE EXEMPLO", "-4", "PA", "ELEITO POR QP"),
       cand("DEPUTADO ESTADUAL", "60012", "22111", "MARIA DE TESTE", "MARIA TESTE", "-4", "PB", "SUPLENTE"),
       cand("DEPUTADO ESTADUAL", "60013", "33111", "PEDRO AMOSTRA NETO", "PEDRO AMOSTRA", "-4", "PC", "ELEITO"),
       cand("DEPUTADO ESTADUAL", "60014", "44111", "LUCAS SILVA SECRETARIO", "LUCAS SECRETARIO", "-4", "PD", "ELEITO POR MÉDIA"),
       cand("SENADOR", "60021", "131", "SENADORA EXEMPLO DE SOUZA", "SENADORA EXEMPLO", "-4", "PA", "ELEITO"),
       cand("GOVERNADOR", "60031", "13", "GOVERNADOR EXEMPLO", "GOVERNADOR EXEMPLO", "-4", "PA", "2º TURNO", 1),
       cand("GOVERNADOR", "60031", "13", "GOVERNADOR EXEMPLO", "GOVERNADOR EXEMPLO", "-4", "PA", "ELEITO", 2),
       cand("VICE-GOVERNADOR", "60032", "13", "VICE EXEMPLO", "VICE EXEMPLO", "-4", "PA", "ELEITO", 2)]
c18 = [cand("SENADOR", "50021", "222", "SENADOR TESTE DA SILVA", "SENADOR TESTE", "-4", "PC", "ELEITO")]
c26 = [cand("DEPUTADO FEDERAL", "70001", "1301", "ANA EXEMPLO DA SILVA", "ANA EXEMPLO", "-4", "PA", "ELEITO POR QP"),
       cand("DEPUTADO FEDERAL", "70002", "1555", "NOVA FEDERAL", "NOVA FEDERAL", "-4", "PE", "ELEITO"),
       cand("DEPUTADO ESTADUAL", "70011", "13111", "JOSE EXEMPLO FILHO", "DR. JOSE EXEMPLO", "-4", "PA", "NÃO ELEITO"),
       cand("DEPUTADO ESTADUAL", "70012", "44444", "NOVO ESTADUAL", "NOVO ESTADUAL", "-4", "PE", "ELEITO"),
       cand("GOVERNADOR", "70031", "13", "GOVERNADOR EXEMPLO", "GOVERNADOR EXEMPLO", "-4", "PA", "ELEITO", 1)]
tse_fx = {}
for ano, linhas in ((2018, c18), (2022, c22), (2026, c26)):
    tse_fx["consulta_cand_%d.zip" % ano] = zipa("tse_consulta_%d.zip" % ano, {"consulta_cand_%d_CE.csv" % ano: csv_tse(CAB, linhas), "leiame.pdf": b"x"})
    sqs = [l[2] for l in linhas]
    tse_fx["rede_social_candidato_%d_CE.zip" % ano] = zipa("tse_redes_%d.zip" % ano, {"rede_social_candidato_%d_CE.csv" % ano: csv_tse(
        ["SG_UF", "SQ_CANDIDATO", "NR_ORDEM_REDE_SOCIAL", "DS_URL"], [["CE", sq, 1, "https://www.instagram.com/perfil%s" % sq] for sq in sqs] + [["CE", sqs[0], 2, "https://x.com/perfil%s" % sqs[0]]])})
    tse_fx["bem_candidato_%d.zip" % ano] = zipa("tse_bens_%d.zip" % ano, {"bem_candidato_%d_CE.csv" % ano: csv_tse(
        ["SG_UF", "SQ_CANDIDATO", "DS_TIPO_BEM_CANDIDATO", "DS_BEM_CANDIDATO", "VR_BEM_CANDIDATO"], [["CE", sq, "Casa", "Casa em Fortaleza", "350000,00"] for sq in sqs] + [["CE", sqs[0], "Veículo", "Carro", "80000,00"]])})
    tse_fx["votacao_candidato_munzona_%d.zip" % ano] = zipa("tse_votos_%d.zip" % ano, {"votacao_candidato_munzona_%d_CE.csv" % ano: csv_tse(
        ["SG_UF", "NR_TURNO", "NM_MUNICIPIO", "NR_ZONA", "SQ_CANDIDATO", "QT_VOTOS_NOMINAIS"],
        [["CE", l[10], m, z, l[2], random.randint(100, 5000)] for l in linhas for m in ("FORTALEZA", "SOBRAL", "JUAZEIRO DO NORTE", "CRATO") for z in (1, 2)])})
    tse_fx["prestacao_de_contas_eleitorais_candidatos_%d.zip" % ano] = zipa("tse_contas_%d.zip" % ano, {
        "receitas_candidatos_%d_CE.csv" % ano: csv_tse(["SG_UF", "SQ_CANDIDATO", "DS_FONTE_RECEITA", "DS_ORIGEM_RECEITA", "NR_CPF_CNPJ_DOADOR", "NM_DOADOR", "NM_DOADOR_RFB", "VR_RECEITA"],
            [["CE", sq, "Fundo Especial", "Recursos de partido político", "", "PARTIDO", "PARTIDO", "200000,00"] for sq in sqs]
            + [["CE", sq, "Outros Recursos", "Recursos de pessoas físicas", "222%05d" % k, "DOADOR %d" % k, "DOADOR %d" % k, "500,00"] for sq in sqs[:3] for k in range(40)]
            + [["CE", sqs[-1 if len(sqs) < 2 else 1], "Outros Recursos", "Recursos próprios", "", "", "", "150000,00"], ["CE", sqs[-1 if len(sqs) < 2 else 1], "Outros Recursos", "Recursos de pessoas físicas", "33300001", "EMPRESARIO RICO", "EMPRESARIO RICO", "90000,00"]]),
        "receitas_candidatos_doador_originario_%d_CE.csv" % ano: csv_tse(["SQ_CANDIDATO", "VR_RECEITA"], [[sqs[0], "999999999,00"]])})
    fotos = {"FCE%s_div.jpg" % sq: foto_jpg((40 * i % 255, 120, 90)) for i, sq in enumerate(sqs)}
    tse_fx["foto_cand%d_CE_div.zip" % ano] = zipa("tse_fotos_%d.zip" % ano, fotos)
plano = pdf("PLANO DE GOVERNO 2023-2026\n\nEIXO SAUDE\n• Construir 10 novas policlínicas regionais pelo SUS no interior do estado.\n"
            "• Ampliar a atenção básica com 500 novas equipes de saúde da família.\nEIXO EDUCACAO\n• Garantir escola pública em tempo integral para todos os jovens do ensino médio.\n"
            "• Implantar creches em todos os 184 municípios do Ceará.\n• Conceder rodovias estaduais à iniciativa privada por meio de parceria público-privada.\nO Ceará que queremos é de todos.")
for ano, sq in ((2022, "60031"), (2026, "70031")):
    tse_fx["proposta_governo_%d_CE.zip" % ano] = zipa("tse_proposta_%d.zip" % ano, {"proposta_governo_%d_CE/%s/plano.pdf" % (ano, sq): plano or b"%PDF-1.4"})

# ------------------------------------------------------------------ Emendas e Siconfi
em_cab = ["Código da Emenda", "Ano da Emenda", "Tipo de Emenda", "Código do Autor da Emenda", "Nome do Autor da Emenda", "Número da emenda", "Localidade de aplicação do recurso",
          "Código Município IBGE", "Município", "Código UF IBGE", "UF", "Código Função", "Nome Função", "Valor Empenhado", "Valor Liquidado", "Valor Pago"]
em_l = [[str(202300000 + i), ANO - (i % 2), "Emenda Individual - Transferências Especiais", "1", a, str(i), "SOBRAL - CE", "2312908", "SOBRAL", "23", "CE", "10", f, "100000,00", "90000,00", "80000,00"]
        for i, (a, f) in enumerate([("ANA EXEMPLO", "Saúde"), ("ANA EXEMPLO", "Educação"), ("BRUNO TESTE", "Encargos especiais"), ("BRUNO TESTE", "Urbanismo"), ("SENADORA EXEMPLO", "Assistência social"), ("OUTRO DE SP", "Saúde")])]
emendas_zip = zipa("portal_emendas.zip", {"EmendasParlamentares.csv": (";".join('"%s"' % c for c in em_cab) + "\n" + "\n".join(";".join('"%s"' % c for c in l) for l in em_l)).encode("latin-1")})
COL = "DESPESAS LIQUIDADAS ATÉ O BIMESTRE (h)"
siconfi = {"items": [{"conta": f, "coluna": COL, "valor": v} for f, v in [("Saúde", 5.2e9), ("Educação", 6.1e9), ("Segurança Pública", 3.4e9), ("Assistência Social", 0.9e9),
                                                                         ("Encargos Especiais", 4.0e9), ("Administração", 1.5e9), ("Atenção Básica", 2.0e9), ("Habitação", 0.3e9)]]
           + [{"conta": "Saúde", "coluna": "DOTAÇÃO ATUALIZADA (a)", "valor": 7e9}]}

radar_det = {"dados": {"id": 5005, "siglaTipo": "PL", "numero": 105, "ano": ANO, "ementa": EMENTAS[5],
                       "statusProposicao": {"dataHora": "%d-10-20T10:00" % ANO, "siglaOrgao": "PLEN", "regime": "Urgência (Art. 155, RICD)", "descricaoSituacao": "Pronta para Pauta no PLENÁRIO (PLEN)", "descricaoTramitacao": "Aprovado requerimento de urgência"}}}
radar_aut = {"dados": [{"nome": "Ana Exemplo", "tipo": "Deputado"}, {"nome": "Fulano de Outro Estado", "tipo": "Deputado"}]}
# IBGE e jornais
cidades = [{"id": 2304400, "nome": "Fortaleza"}, {"id": 2312908, "nome": "Sobral"}, {"id": 2307304, "nome": "Juazeiro do Norte"}, {"id": 2303709, "nome": "Crato"}]
ibge_res = [{"id": 1, "res": [{"localidade": str(c["id"])[:6], "res": {"2010": "%.3f" % (0.6 + 0.03 * i), "2000": "0.5"}} for i, c in enumerate(cidades)]}]
rss_jornal = ('<?xml version="1.0"?><rss><channel><title>Jornal</title>'
              '<item><title>Câmara aprova urgência do PL 105/%d que privatiza empresa de água</title><link>https://jornal.exemplo/1</link><pubDate>Mon, 26 Oct %d 10:00:00 GMT</pubDate></item>'
              '<item><title>Ana Exemplo defende ampliar o porte de arma para atiradores</title><link>https://jornal.exemplo/2</link><pubDate>Tue, 27 Oct %d 10:00:00 GMT</pubDate></item>'
              '<item><title>Chuva forte em Fortaleza</title><link>https://jornal.exemplo/3</link><pubDate>Tue, 27 Oct %d 10:00:00 GMT</pubDate></item>'
              '</channel></rss>') % (ANO, ANO, ANO, ANO)
rss_google = ('<?xml version="1.0"?><rss><channel><item><title>Extrema-direita articula nova ofensiva no Congresso - O Povo</title><link>https://news.google.com/rss/articles/abc</link>'
              '<pubDate>Wed, 28 Oct %d 10:00:00 GMT</pubDate><source url="https://www.opovo.com.br">O Povo</source></item></channel></rss>') % ANO
comum.FALSO = {
    "re:/localidades/estados/23/municipios": grava("ibge_municipios.json", cidades),
    "re:/pesquisas/indicadores/": grava("ibge_indicador.json", ibge_res),
    "re:news\\.google\\.com/rss/search": grava("google_noticias.xml", rss_google),
    "re:(g1\\.globo\\.com/rss|feeds\\.folha|estadao\\.com\\.br/arc)": grava("jornal.xml", rss_jornal),
    "re:/proposicoes/\\d+/autores": grava("camara_radar_autores.json", radar_aut),
    "re:/proposicoes/\\d+$": grava("camara_radar_detalhe.json", radar_det),
    # Câmara
    "re:/deputados/900$": grava("camara_detalhe.json", detalhe),
    "re:/deputados/\\d+$": grava("camara_detalhe_outro.json", {"dados": {"ultimoStatus": {"situacao": "Exercício"}}}),
    "re:/presenca-plenario/": grava("camara_presenca.html", presenca_html),
    "re:/bandep/": grava("foto_camara.jpg", foto_jpg((200, 60, 40))),
    "Ano-%d.csv.zip" % ANO: zipa("camara_cotas.zip", {"Ano-%d.csv" % ANO: cotas.encode("utf-8")}),
    "/deputados": grava("camara_deputados.json", {"dados": deps, "links": []}),
    "/despesas": grava("camara_despesas.json", desp),
    "/proposicoes": grava("camara_proposicoes.json", props),
    "/votos": grava("camara_votos.json", votos),
    "/votacoes": grava("camara_votacoes.json", vots),
    # Senado
    "/senador/lista/atual.json": grava("senado_lista.json", lista_sen),
    "despesa_ceaps_%d.csv" % ANO: grava("senado_ceaps.csv", ceaps, "latin-1"),
    "/votacoes.json": grava("senado_votacoes.json", vot_sen),
    "/autorias.json": grava("senado_autorias.json", aut_sen),
    "re:fotos-oficiais": grava("foto_senado.jpg", foto_jpg((30, 60, 160))),
    # ALECE
    "/consultas-gerais/votacao-nominal": grava("alece_votacao.html", pagina),
    "/verba-desempenho-parlamentar/csv": grava("alece_vdp.csv", alece_csv),
    "emendas-parlamentares/UNICO": emendas_zip,
    "/siconfi/tt/rreo": grava("siconfi_rreo.json", siconfi),
}
for k in range(4):
    comum.FALSO["alece_vot%d.xlsx" % k] = os.path.join(FX, "alece_vot%d.xlsx" % k)
comum.FALSO.update(pdfs)
comum.FALSO.update(tse_fx)
comum.DADOS = SAIDA
comum.FOTOS = os.path.join(SAIDA, "fotos")
import avisos  # noqa: E402
import tse  # noqa: E402
avisos.FEEDS = os.path.join(SAIDA, "feeds")
tse.FOTOS = comum.FOTOS
import camara  # noqa: E402
import senado  # noqa: E402
camara.salvar_foto = senado.salvar_foto = tse.salvar_foto = comum.salvar_foto
import rodar  # noqa: E402

codigo = rodar.principal()
L = lambda n: json.load(open(os.path.join(SAIDA, n), encoding="utf-8"))  # noqa: E731
ps, vs, meta, gov, ele = L("parlamentares.json"), L("votacoes.json"), L("meta.json"), L("governo.json"), L("eleicao.json")
por = {p["id"]: p for p in ps}
casas = {c: [p for p in ps if p["casa"] == c] for c in ("camara", "senado", "alece")}
falhas = []


def confere(cond, msg):
    if not cond:
        falhas.append(msg)


confere(codigo == 0, "código de saída")
confere(len(casas["camara"]) == 5 and len(casas["senado"]) == 2, {k: len(v) for k, v in casas.items()})
confere(len(casas["alece"]) == 4, "ALECE deveria ter 3 da verba + 1 eleito licenciado: %s" % [p["nome"] for p in casas["alece"]])
confere(any(p.get("fora_exercicio") for p in casas["alece"]), "licenciado não marcado")
confere(all(f.get("ok") for f in meta["fontes"].values()), {k: f.get("erro") for k, f in meta["fontes"].items() if not f.get("ok")})
# fotos e partidos
sem_foto = [p["nome"] for p in ps if not p.get("foto")]
confere(not sem_foto, "sem foto: %s" % sem_foto)
confere(all(os.path.exists(os.path.join(SAIDA, p["foto"])) for p in ps if p.get("foto")), "arquivo de foto ausente")
confere(all(p.get("partido") for p in casas["alece"]), "ALECE sem partido")
confere(por["a-jose-exemplo"]["fontes"]["foto"]["u"].startswith("https://dadosabertos.tse.jus.br"), "fonte da foto")
# redes sociais
confere("https://www.instagram.com/anaexemplo" in por["c900"]["redes"] and any("perfil60001" in u for u in por["c900"]["redes"]), por["c900"].get("redes"))
confere(any("perfil60011" in u for u in por["a-jose-exemplo"].get("redes", [])), "redes ALECE")
confere(por["s72"].get("redes"), "senador de 2018 sem redes do TSE")
# TSE extra
confere(por["c900"]["bens"]["total"] == 430000.0, por["c900"].get("bens"))
confere(por["c900"]["votos"]["municipios"][0][1] > 0 and por["c900"]["votos"]["n_municipios"] == 4, por["c900"].get("votos"))
confere(por["c901"]["receitas"]["proprios"] == 150000.0 and por["c901"]["receitas"]["maiores"], por["c901"].get("receitas"))
confere(por["c900"]["receitas"]["total"] < 1e8, "somou o arquivo de doador originário")
confere(por["c900"]["tse"]["em2026"]["situacao"].lower().startswith("eleito"), por["c900"]["tse"].get("em2026"))
confere(por["a-jose-exemplo"]["tse"]["em2026"]["situacao"].lower().startswith("não"), por["a-jose-exemplo"]["tse"].get("em2026"))
confere(len(ele["eleitos2026"]) == 4 and any(e["atual"] == "c900" for e in ele["eleitos2026"]), ele["eleitos2026"])
confere(all(e.get("foto_tse") for e in ele["eleitos2026"] if not e.get("atual")), "eleitos 2026 sem foto")
# Câmara: presença, viagens, emendas, projetos
confere(por["c900"]["presenca"]["pct"] == round(100 * 40 / 45, 1), por["c900"].get("presenca"))
confere(por["c900"]["viagens"]["n"] == 3 and por["c900"]["viagens"]["ultimas"][0]["trecho"] in ("FOR/BSB", "BSB/FOR"), por["c900"].get("viagens"))
confere(por["s71"].get("viagens", {}).get("n") == 9, "viagens do Senado")
confere(por["c900"]["emendas"]["pct_servicos"] == 100.0 and por["c901"]["emendas"]["pct_servicos"] == 50.0, [por["c900"].get("emendas"), por["c901"].get("emendas")])
confere(por["s71"].get("emendas"), "emendas da senadora")
pc = por["c900"]["projetos"]
confere(any(x["homenagem"] for x in pc) and not any("lado" in x for x in pc), "projetos não podem ter 'lado'")
# ALECE: projetos dos PDFs
if pdf("x"):
    pj = por["a-jose-exemplo"].get("projetos") or []
    confere(len(pj) == 2, [x["ementa"] for x in pj])
    confere(any(x["homenagem"] for x in por["a-maria-teste"].get("projetos", [])), "homenagem ALECE")
    confere(gov["mensagens_resumo"]["total"] == 1 and gov["mensagens_resumo"]["por_tema"], gov.get("mensagens_resumo"))
    confere(gov["governador"]["plano"]["promessas"] and gov["governador"]["plano"]["promessas"][0]["concreta"], gov["governador"].get("plano"))
# votações
confere(len({v["id"] for v in vs}) == len(vs), "votações repetidas")
confere(not any("lado" in v for v in vs), "votações não podem ter 'lado'")
confere(vs[0]["url"].startswith("https://www.camara.leg.br/propostas-legislativas/") or vs[0]["casa"] != "camara", vs[0]["url"])
# governo
confere(gov["orcamento"] and list(gov["orcamento"].values())[0]["pct_servicos"] > 50, gov.get("orcamento"))
confere("Atenção Básica" not in [f[0] for f in list(gov["orcamento"].values())[0]["funcoes"]], "subfunção entrou como função")
# radar
rad = L("radar.json")
cam = [i for i in rad["itens"] if i["casa"] == "camara"]
confere(cam and cam[0]["etapa"] == 3 and "privatizacao" in cam[0]["temas"] and cam[0]["autores_ce"] == ["c900"], cam)
if pdf("x"):
    al = [i for i in rad["itens"] if i["casa"] == "alece"]
    confere(al and al[0]["autores_ce"] == ["a-pedro-amostra"], al)
# cidades
mu = L("municipios.json")["municipios"]
confere(mu["Sobral"].get("idhm") and mu["Sobral"].get("prioridade") is not None and mu["Sobral"].get("pos_prioridade"), mu.get("Sobral"))
confere(mu["Sobral"].get("emendas_pc") and mu["Sobral"]["emendas"] > 0, "emendas por habitante de Sobral")
# notícias
no = L("noticias.json")["itens"]
confere(len(no) >= 3 and all(i["temas"] for i in no), [i["titulo"] for i in no])
confere(any("c5005" in i["radar"] for i in no), "notícia não ligada ao projeto do Radar")
confere(any("c900" in i["pessoas"] for i in no), "notícia não ligada à deputada citada")
confere(not any("Chuva" in i["titulo"] for i in no), "notícia sem relação entrou")
confere(any(i["titulo"].endswith("Congresso") for i in no), "nome do jornal não saiu do título do Google")
# avisos
confere(os.path.exists(os.path.join(SAIDA, "feeds", "c900.xml")), "feed RSS")
if falhas:
    print("\nFALHOU:")
    for f in falhas:
        print("  -", f)
    sys.exit(1)
print("\nTESTE OK")
