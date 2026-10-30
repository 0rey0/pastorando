# Pastorando

**O povo pastorando o poder.** Gastos, votos, projetos, presença, viagens, emendas, campanha e a Régua do Povo dos deputados estaduais, deputados federais, senadores e do governo do Ceará. São dados oficiais, atualizados todo dia por um robô.

Ao lado de cada informação existe um **ⓘ** que leva ao site oficial de onde ela saiu.

- **Custo para manter: R$ 0.** O site é estático (GitHub Pages) e o robô roda no GitHub Actions, que é gratuito para repositórios públicos.
- **Para usar:** grátis, sem cadastro e sem rastreamento. A lista de "Seguindo" fica guardada no aparelho de cada pessoa.

## Colocar no ar (sem programar)

1. Crie uma conta em [github.com](https://github.com) e um repositório **público** chamado `pastorando`.
2. Na página do repositório, clique em **Add file → Upload files**.
3. Abra a pasta `pastorando` no computador. Selecione **tudo o que está dentro dela** (Ctrl+A no Windows, Cmd+A no Mac) e **arraste** para a página. Use o Chrome ou o Edge, porque eles mandam as pastas junto.
4. Clique em **Commit changes**.
5. Confira se a pasta `.github` apareceu no repositório. Se não apareceu, crie os dois arquivos à mão: **Add file → Create new file**, escreva o nome `.github/workflows/atualizar.yml`, cole o conteúdo e salve. Repita para `testes.yml`.
6. Vá em **Settings → Pages**. Em **Source**, escolha **GitHub Actions**.
7. Vá em **Actions → Atualizar dados e publicar o site → Run workflow**.
8. Na primeira vez, a execução leva de 30 a 60 minutos, porque baixa os arquivos grandes do TSE. Nos dias seguintes, uns 10 minutos.

## Opcional (tudo grátis)

Cadastre estes itens em **Settings → Secrets and variables → Actions → New repository secret**:

| Nome | Para quê | Como conseguir |
| --- | --- | --- |
| `TELEGRAM_TOKEN` | Robô que posta as novas votações num canal | No Telegram, fale com `@BotFather` e use `/newbot` |
| `TELEGRAM_CANAL` | Nome do canal público, por exemplo `@pastorandoce` | Crie o canal e coloque o robô como administrador |
| `PORTAL_CHAVE` | Plano B para as emendas, caso o arquivo do Portal falhe | [Cadastro da API do Portal da Transparência](https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email) |

## De onde vem cada dado

| O quê | Fonte oficial |
| --- | --- |
| Gastos, projetos, votos, presença e viagens dos deputados federais | [Câmara, dados abertos](https://dadosabertos.camara.leg.br) e arquivo anual da cota |
| Gastos, projetos, votos e viagens dos senadores | [Senado, dados abertos](https://legis.senado.leg.br/dadosabertos/docs/) e planilha do CEAPS |
| Gastos e votos dos deputados estaduais | [Portal da Transparência da ALECE](https://transparencia.al.ce.gov.br) (Verba de Desempenho e votações nominais) |
| Projetos dos deputados estaduais e do governador | PDFs de tramitação da ALECE (`www2.al.ce.gov.br/legislativo/tramitANO/`) |
| Fotos, partido, redes sociais, bens, votos por cidade, quem bancou a campanha, eleitos de 2026, plano de governo | [TSE, dados abertos](https://dadosabertos.tse.jus.br) |
| Emendas parlamentares | [Portal da Transparência, CGU](https://portaldatransparencia.gov.br/download-de-dados/emendas-parlamentares) |
| Para onde vai o dinheiro do estado | [Tesouro Nacional, Siconfi](https://apidatalake.tesouro.gov.br/docs/siconfi/) (RREO, despesa por função) |

## Régua do Povo

A nota não usa pesquisa de opinião. Ela segue regras públicas, que estão em `config/regua.json`, e **privilegia quem defende serviços públicos e direitos do povo trabalhador**. São cinco partes:

| Parte | Peso | Como é medida |
| --- | --- | --- |
| Votos a favor do povo | 35 | Nas votações sobre SUS, escola pública, salário, moradia e direitos, votar SIM conta ponto. Nas votações de privatização, retirada de direitos ou benefício aos mais ricos, votar NÃO conta ponto. |
| Projetos a favor do povo | 25 | Projetos que ampliam serviços e direitos somam; projetos de privatização ou retirada de direitos subtraem. Homenagens não contam. |
| Cuidado com o dinheiro público | 15 | Gasto da verba comparado aos colegas, concentração num só fornecedor e quanto das emendas foi para saúde, educação, assistência e outros serviços. |
| Presença e participação | 15 | Presença no plenário. Quando a Casa não publica, conta a participação nas votações nominais. |
| Independência do dinheiro grande | 10 | Campanha de doações pequenas pontua mais; grandes doadores e autofinanciamento pontuam menos. |

- **Como mudar as regras:** edite as listas de palavras em `config/regua.json`.
- **Como corrigir uma votação mal classificada:** use `config/votacoes_manuais.json` e escreva o motivo.
- **Como registrar promessas de campanha:** use `config/promessas.json`, sempre com o link da prova.
- **Quando a nota aparece:** só com pelo menos três partes calculadas. Cada pessoa é comparada apenas com colegas da mesma Casa.

## Avisos

- Cada político tem um feed RSS em `feeds/ID.xml`.
- O site avisa no próprio aparelho quando há novidade de quem a pessoa segue.
- Há um canal no Telegram, se você configurar os segredos da seção "Opcional".

## O que depende da primeira rodada

Os robôs foram testados sem internet, com respostas no mesmo formato das fontes oficiais. Se alguma fonte tiver mudado de formato, o site continua no ar com os últimos dados bons. A página **Dados abertos** mostra qual fonte falhou, e o erro detalhado aparece na aba **Actions**.

Os projetos da ALECE são lidos aos poucos: até 350 novos por tipo a cada dia. O ano inteiro entra em poucos dias.

## Para quem programa

- `coleta/`: os robôs, em Python. Usam `openpyxl`, `pypdf` e `Pillow`.
- `site/`: HTML, CSS e JavaScript puros. O site lê os arquivos de `site/dados/`.
- Testes sem internet: `pip install -r requirements.txt reportlab` e depois `python testes/teste_coleta.py`.
- Para rodar no seu computador: `python coleta/rodar.py` e depois `cd site && python -m http.server`.
