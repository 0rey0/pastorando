# Pastorando

**O povo pastorando o poder.** Gastos, votos, projetos e a Régua do Povo dos deputados estaduais, deputados federais e senadores do Ceará, com dados oficiais atualizados todo dia por um robô.

- Custo para manter: **R$ 0**. O site é estático (GitHub Pages) e o robô roda no GitHub Actions, gratuito para repositórios públicos.
- Para usar: grátis, sem cadastro e sem rastreamento. A lista de "Seguindo" fica guardada no aparelho de cada pessoa.

## Colocar no ar (uns 15 minutos, sem programar)

1. Crie uma conta em [github.com](https://github.com) (grátis).
2. Clique em **New repository**. Nome: `pastorando`. Marque **Public**. Clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**. Arraste **todo o conteúdo** desta pasta (as pastas `coleta`, `config`, `site`, `testes` e os arquivos soltos). Clique em **Commit changes**.
4. A pasta `.github` costuma ficar de fora no envio pelo navegador, porque começa com ponto. Confira se ela aparece no repositório. Se não aparecer:
   - clique em **Add file → Create new file**;
   - no nome, escreva `.github/workflows/atualizar.yml`;
   - cole o conteúdo do arquivo de mesmo nome desta pasta e clique em **Commit changes**;
   - repita o processo para `.github/workflows/testes.yml`.
5. Vá em **Settings → Pages**. Em **Source**, escolha **GitHub Actions**.
6. Vá em **Actions**, clique em **Atualizar dados e publicar o site** e depois em **Run workflow**.
7. Espere de 5 a 15 minutos. O endereço aparece no resumo da execução: `https://SEU-USUARIO.github.io/pastorando/`.

A partir daí, o robô roda sozinho todo dia às 6h17. Se uma fonte oficial sair do ar, o site continua com os últimos dados bons, e a página **Sobre** mostra qual fonte falhou.

**Endereço próprio (opcional e pago):** registre o domínio (por exemplo, `pastorando.com.br`) no [Registro.br](https://registro.br). Depois configure em **Settings → Pages → Custom domain**. É o único custo possível do projeto.

## De onde vêm os dados

| Casa | Fonte | O que entra |
| --- | --- | --- |
| Câmara (22 federais) | [API de dados abertos da Câmara](https://dadosabertos.camara.leg.br) | cota parlamentar, projetos, votações nominais do plenário |
| Senado (3 senadores) | [API de dados abertos do Senado](https://legis.senado.leg.br/dadosabertos/docs/) e planilha do CEAPS | cota, projetos, votações |
| Assembleia (46 estaduais) | [Portal da Transparência da ALECE](https://transparencia.al.ce.gov.br) | Verba de Desempenho Parlamentar (CSV mensal) e votações nominais (planilhas) |

## Régua do Povo (automática)

Ninguém escolhe os pesos à mão. Eles vêm de pesquisas de opinião registradas em `config/pesquisas.json`:

- **Peso de cada parte da nota**: o que o eleitor diz que mais pesa no voto (Quaest, set/2026). Fica em honestidade 37, compromisso 34 e prioridades do povo 29.
- **Peso de cada tema dentro de "prioridades do povo"**: o que a população aponta como maior problema. Para a Assembleia, a referência é a Quaest Ceará (set/2026), com violência em 54%. Para Câmara e Senado, é o Datafolha (out/2026).

As três partes da nota:

1. **Honestidade com o dinheiro público**: quanto gasta comparado aos colegas da mesma Casa e se concentra os gastos num só fornecedor.
2. **Compromisso e presença**: em quantas votações nominais votou.
3. **Trabalho nas prioridades do povo**: projetos apresentados, valendo mais os temas que a população mais cobra. Homenagens valem zero.

A nota só aparece quando há pelo menos duas partes calculadas; antes disso, o deputado aparece "em observação".

Quando sair pesquisa nova, basta editar `config/pesquisas.json` pelo próprio GitHub. A nota se recalcula na rodada seguinte. Para ligar uma votação a uma pesquisa sobre o mesmo assunto (por exemplo, a maioria a favor do fim da escala 6x1), preencha `votos_com_o_povo` nesse mesmo arquivo.

## Para quem programa

- `coleta/`: robôs em Python, só com a biblioteca padrão (mais `openpyxl` para as planilhas da ALECE).
- `site/`: HTML, CSS e JavaScript puros. Lê `site/dados/*.json`.
- `python testes/teste_coleta.py`: testa tudo sem internet, com respostas no formato das APIs oficiais.
- Para rodar localmente: `python coleta/rodar.py` e depois `cd site && python -m http.server`.

## Próximos passos

Governador (Ceará Transparente), presença nas sessões, promessas de campanha, viagens, emendas por cidade (Portal da Transparência), dados do TSE e avisos por Telegram.
