# EspiaCE

**Espia só o que teu político anda fazendo.** O EspiaCE mostra gastos, votos, projetos, presença, viagens, emendas e campanha dos deputados estaduais, dos deputados federais, dos senadores e do governo do Ceará. Tem também o Radar do Retrocesso, para o povo ficar de olho e cobrar. Tudo vem de dados oficiais, atualizados todo dia por um robô.

Ao lado de cada informação há um **ⓘ** que leva ao site oficial de onde ela saiu.

- **Custo para manter: R$ 0.** O site é estático (GitHub Pages) e o robô roda no GitHub Actions, que é gratuito para repositórios públicos.
- **Para usar:** grátis, sem cadastro e sem rastreamento. Quem a pessoa segue e os projetos que ela espia ficam guardados só no aparelho dela.

## Colocar no ar (sem programar)

1. Crie uma conta em [github.com](https://github.com) e um repositório **público** chamado `espiace`.
2. Na página do repositório, clique em **Add file → Upload files**.
3. Abra a pasta `espiace` no computador. Selecione **tudo o que está dentro dela** (Ctrl+A no Windows, Cmd+A no Mac) e **arraste** para a página. Use o Chrome ou o Edge, porque eles mandam as pastas junto.
4. Espere a lista de arquivos parar de crescer e clique em **Commit changes**.
5. Confira se a pasta `.github` apareceu no repositório. Se não apareceu, crie os dois arquivos à mão:
   - clique em **Add file → Create new file**;
   - escreva o nome `.github/workflows/atualizar.yml`;
   - cole o conteúdo do arquivo de mesmo nome que está na pasta e salve;
   - repita para `testes.yml`.
6. Vá em **Settings → Pages**. Em **Source**, escolha **GitHub Actions**.
7. Vá em **Settings → Actions → General**. Em **Workflow permissions**, marque **Read and write permissions** e clique em **Save**.
8. Vá em **Actions → Atualizar dados e publicar o site (EspiaCE) → Run workflow**.
9. Espere. Na primeira vez leva de 30 a 60 minutos, porque o robô baixa os arquivos grandes do TSE. Nos dias seguintes, uns 10 minutos.
10. O endereço aparece em **Settings → Pages**. Ele tem o formato `https://SEU-USUARIO.github.io/espiace/`.

Depois disso, o robô roda sozinho todo dia às 6h17. Se uma fonte oficial sair do ar, o site continua com os últimos dados bons, e a página **Dados abertos** mostra qual fonte falhou.

**Endereço próprio (opcional e pago):** registre o domínio no [Registro.br](https://registro.br), por exemplo `espiace.com.br`. Depois configure em **Settings → Pages → Custom domain**. É o único custo possível do projeto.

## Opcional (tudo grátis)

Cadastre estes itens em **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Para quê | Como conseguir |
| --- | --- | --- |
| `TELEGRAM_TOKEN` | Robô que avisa num canal quando há votação nova ou quando um projeto do Radar avança | No Telegram, fale com `@BotFather` e use `/newbot` |
| `TELEGRAM_CANAL` | Nome do canal público, por exemplo `@espiace` | Crie o canal e coloque o robô como administrador |
| `PORTAL_CHAVE` | Plano B para as emendas, caso o arquivo do Portal falhe | [Cadastro da API do Portal da Transparência](https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email) |

## De onde vem cada dado

| O quê | Fonte oficial |
| --- | --- |
| Gastos, projetos, votos, presença e viagens dos deputados federais | [Câmara, dados abertos](https://dadosabertos.camara.leg.br) e arquivo anual da cota |
| Gastos, projetos, votos e viagens dos senadores | [Senado, dados abertos](https://legis.senado.leg.br/dadosabertos/docs/) e planilha do CEAPS |
| Gastos e votos dos deputados estaduais | [Portal da Transparência da ALECE](https://transparencia.al.ce.gov.br) (Verba de Desempenho e votações nominais) |
| Projetos dos deputados estaduais e do governador | PDFs de tramitação da ALECE (`www2.al.ce.gov.br/legislativo/tramitANO/`) |
| Fotos, partido, redes sociais, bens, votos por cidade, quem pagou a campanha, eleitos de 2026 e plano de governo | [TSE, dados abertos](https://dadosabertos.tse.jus.br) |
| Emendas parlamentares | [Portal da Transparência, CGU](https://portaldatransparencia.gov.br/download-de-dados/emendas-parlamentares) |
| Para onde vai o dinheiro do estado | [Tesouro Nacional, Siconfi](https://apidatalake.tesouro.gov.br/docs/siconfi/) (RREO, despesa por função) |
| Mapa dos 184 municípios | IBGE, malha municipal (arquivo `site/mapa-ce.json`) |
| Indicadores das cidades (população, IDHM, PIB, mortalidade infantil, escola, salário) | [IBGE, API de pesquisas](https://servicodados.ibge.gov.br/api/docs/pesquisas) e [IBGE Cidades](https://cidades.ibge.gov.br/brasil/ce/panorama) |
| Notícias | RSS dos jornais e Google Notícias filtrado por site (só título, link e data) |

## Radar do Retrocesso

O Radar do Retrocesso mostra os projetos da agenda da extrema-direita, que fazem o país andar para trás, que se mexeram nos últimos 90 dias:

- armas;
- ataque ao aborto legal;
- Escola sem Partido;
- anistia a golpistas;
- ataque a direitos LGBT;
- criminalização de movimentos sociais;
- retirada de direitos do trabalho;
- ataque ao meio ambiente e aos indígenas;
- privatização.

Para cada projeto, o site mostra:
- em que etapa está e a última movimentação;
- quem assina, com destaque para quem o Ceará elegeu;
- como a bancada do Ceará votou;
- botões para cobrar, espiar e criar a arte pro story.

O robô acha os projetos por palavras-chave, por isso pode trazer um projeto que vai no sentido contrário (por exemplo, um que protege o aborto legal). Tudo fica em `config/radar.json`:
- **Temas e palavras:** podem ser editados.
- **Tirar um projeto que entrou por engano:** ponha o número dele em `excluir`.
- **Acompanhar um projeto que as palavras não pegaram:** ponha o número dele em `fixos`.

O número é o que aparece no endereço da proposta no site da Câmara. Por enquanto, o Radar cobre a Câmara e a Assembleia.

## Cidades e áreas prioritárias

Cada cidade do Ceará tem sua página (`#cidade-Nome`) com população, IDHM e suas três partes (renda, saúde, educação), PIB por pessoa, mortalidade infantil, crianças na escola e salário médio, todos da API de pesquisas do IBGE (`servicodados.ibge.gov.br`), com ⓘ para o IBGE Cidades. O mapa troca entre emendas, IDHM, prioridade e mortalidade infantil.

A página **Áreas prioritárias** ordena as 184 cidades pela média da posição de cada uma em cinco números (IDHM, IDHM Renda, mortalidade infantil, escola e salário): 100 = pior do estado. Ela também mostra as cidades que estão entre as 40 que mais precisam e receberam menos emenda por habitante que a média, com botão para cobrar a bancada federal.

Atenção: o IDHM por cidade é o do Censo 2010 (o último calculado pelo PNUD para todos os municípios). Os outros números usam o ano mais recente que o IBGE publicar. O robô atualiza essa parte uma vez por semana.

## No noticiário

O robô lê, todo dia, notícias de G1, Folha de S.Paulo, Estadão, O Povo e Diário do Nordeste sobre as pautas do Radar. **Nenhum desses jornais tem uma API aberta de notícias**, então o robô usa o RSS público de cada um (quando existe) e a busca do Google Notícias filtrada pelo site do jornal (`site:opovo.com.br`, por exemplo). Entram só as notícias que citam as palavras dos temas do Radar ou os termos gerais (extrema-direita, bolsonarismo). Guardamos só título, link, jornal e data dos últimos 30 dias; o texto fica no site do jornal.

Quando a notícia cita o número de um projeto do Radar (ex.: "PL 1234/2025"), ela aparece no cartão do projeto. Quando cita o nome completo de um político do Ceará, aparece no perfil dele.

Para trocar jornais, feeds ou palavras, edite `config/noticias.json` pelo próprio GitHub (lápis ✏️ no arquivo).

## Promessas

O TSE só guarda plano de governo de candidato a governador. O robô tira dele os compromissos automaticamente. As promessas de deputados e senadores são registradas à mão em `config/promessas.json`, sempre com o link de onde foram feitas e o link da prova do andamento.

## Para quem programa

- `coleta/`: os robôs, em Python. Usam `openpyxl`, `pypdf` e `Pillow`.
- `site/`: HTML, CSS e JavaScript puros, sem biblioteca. O site lê `site/dados/*.json` e `site/mapa-ce.json`.
- Testes sem internet: `pip install -r requirements.txt reportlab` e depois `python testes/teste_coleta.py`.
- Para rodar no seu computador: `python coleta/rodar.py` e depois `cd site && python -m http.server`.
