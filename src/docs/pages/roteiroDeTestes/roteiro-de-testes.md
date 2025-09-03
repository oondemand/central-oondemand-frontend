# 🎯 Roteiro de testes - Central oondemand

## 🔧 Ativação do sistema

**Requisitos**

- Base de dados limpa
- Usuário devidamente cadastrado no aplicativo **Meus apps**

**Passo a passo**

- Acesse a página **/ativacao**

![](ativacao.png)

**nome**: OonDemand Dev **cnpj**: 11111111111112 **appKey**: 3908593091403 **appSecret**: 16eb447588b57e0e9cb7a9a070d8b61c

- Preencher o campo “Chave do aplicativo (appKey)” com chave cadastrada appKey no aplicativo referente em “meus apps” e preencher os dados da base omie.

![](aplicativo.png)

O usuário deverá ser redirecionado para página de login em **Meus apps**

## 🔧 Login

**Requisitos**

- Processo de ativação concluído

**Passo a passo**

- Realizar o login em **Meus apps**
- Clicar em **acessar**

![](acessar-aplicativo.png)

Você deverá ser redirecionado para o dashboard da aplicação. Além disso é valido verificar os dados que deveriam ser preenchidos na ativação. Como por exemplo **Listas omie** em **/listas**, **moedas** em **/moedas** e **assistentes** em **/assistentes**.

## 🔧 Listas

Em listas temos basicamente dois tipos de lista a **lista omie** que é sincronizada com o omie e as demais, que são um tipo de lista somente valor. Essas listas são usadas principalmente nos nossos formulários, como por exemplo **Tipo de serviço**

**Requisitos**

- Processo de ativação concluído

**Passo a passo**

- Acessar **/listas**
- Adicionar **dois** valores diferentes para cada tipo de lista.

**Grupo**: Cliente, prestador **Tipo documento**: CNPJ, CPF **Tipo documento fiscal**: Invoice, nota fiscal **Motivo recusa**: Outro, recusado pelo usuário **Tipo serviço tomado** 3.1 Transporte de mercadoria, venda mercadoria

- Alterar um valor de cada lista.
- Remover um valor de cada lista.

![](lista.png)
Se tudo ocorrer como esperado cada lista deverá conter apenas um valor. E todo processo de **adição/alteração/exclusão** foi validado.

- Adicione mais um valor a lista, desta vez com um valor já existente. Deve ser retornado um erro.

![](erro-lista-valor-existente.png)

## 🔧 Prestadores

OBS: Email e documento são campos obrigatórios do omie, sem eles a integração não funcionará corretamente.
Campo Pais é obrigatório para Prestador do tipo exterior.

📍 **Criação/edição**

![📥 Download da planilha modelo](/documentos/clientes-prestadores.xlsx)

**Requisitos**

- Listas com pelo menos um valor preenchido

**Passo a passo**

- Acesse /pessoas
- Selecione adicionar preencha cada campo, quando terminar feche o dialog, deverá ser listado uma pessoa no datagrid logo após o dialog fechar.
- Edite todos os campos do datagrid. Detalhe quando mudar o campo tipo de pessoa deverá aparecer um dialog de confirmação. Se confirmado as informações preenchidas relacionadas a esse tipo serão perdidas. São elas:

  - Pessoa Física: Rg, data de nascimento e apelido
  - Pessoa jurídica: Regime tributário, nome da fantasia

- Verifique o seguinte comportamento, se o tipo selecionado for pessoa jurídica os campos rg, data de nascimento e apelido ficaram desabilitado no dialog se for pessoa pessoa física os campos regime tributário e nome da fantasia ficarão desabilitados
- Abra o dialog de edição (pequeno botão com ícone de lápis em ações)

Todos os dados devem ter sido atualizados corretamente.

- Verifique o seguinte comportamento, altere novamente o tipo de pessoa selecionada, a mesmo dialog de confirmação deverá aparecer, e quando confirmado o formulário irá se alterar, adicionando os campos relacionados com aquele tipo.

📍 **Exportação**

**Requisitos**

- Pelo menos um Prestador adicionado

**Passo a passo**

- Ainda no datagrid de Prestadores (pessoas), clique em **excel** e em **exportar datagrid**

![](excel-button.png)

- Selecione um local para salvar o arquivo

📍 **Exclusão**

**Requisitos**

- Pelo menos um Prestador adicionado

**Passo a passo**

- Clique em excluir (botão vermelho com ícone de lixeira)
- Confirme a exclusão
- O item deve sumir do datagrid
- Recarregue a página para garantir que não tem nada a ver com algum tipo de cache.

📍 **Importação**

**Requisitos**

**Passo a passo**

- Agora clique em Importar planilha

O usuário deve ser redirecionado para uma página de importação

- Clique em selecionar planilha e escolha o arquivo que separamos.

Deverá aparecer uma box com detalhes da importação:

![](importacao-pessoa.png)

- Volte para **/pessoas** e verifique se os campos informados na tabela de importação foram preenchidos corretamente.

- Tente importar a mesma planilha novamente.

Desta vez deve aparecer um erro na importação, já que estamos importando um Prestador (pessoa) já existente.

![](resumo-importacao.png)

- Faça o download do log de erros. Esse arquivo é um pequeno relatório da importação, registrando em qual linha ocorreu o erro e o motivo do erro.
- Faça o download do arquivo de erro. Esse arquivo é uma planilha somente com registros que deram erro, deixando mais simples para o usuário corrigir os erros e refazer a importação.

## 🔧 Serviços

📍 **Criação/edição**

**Requisitos**

- Listas com pelo menos um valor preenchido
- Pelo menos um prestador adicionado

**Passo a passo**

- Acesse **/serviços**
- Selecione adicionar preencha cada campo, quando terminar feche o dialog, deverá ser listado uma serviço no datagrid logo após o dialog fechar.
- Edite todos os campos no datagrid e atualize a página, verifique se nenhum dado foi perdido.
- Clique no botão de editar serviço (ícone com lápis na coluna de ações) e edite todos os campos novamente. Atualize a página e certifique que nenhum dado foi perdido.

📍 **Exportação**

**Requisitos**

- Pelo menos um serviço adicionado

**Passo a passo**

- Ainda no datagrid de serviços, clique em **excel** e em **exportar datagrid**

![](excel-button.png)

- Selecione um local para salvar o arquivo

📍 **Exclusão**

**Requisitos**

- Pelo menos um serviço adicionado

**Passo a passo**

- Clique em excluir (botão vermelho com ícone de lixeira)
- Confirme a exclusão
- O item deve sumir do datagrid
- Recarregue a página para garantir que não tem nada a ver com algum tipo de cache.

📍 **Importação**

**Requisitos**

**Passo a passo**

- Agora clique em Importar planilha

O usuário deve ser redirecionado para uma página de importação

- Clique em selecionar planilha e escolha o arquivo que separamos.

Deverá aparecer uma box com detalhes da importação:

![](importacao-servicos.png)

- Volte para **/servicos** e verifique se os campos informados na tabela de importação foram preenchidos corretamente.

## 🔧 Planejamento

**Requisitos**

- Listas com pelo menos um valor preenchido
- Pelo menos um serviço adicionado (com as datas de contratação e conclusão preenchidas)

**Passo a passo**

- Acesse **/serviços**
- Adicione um novo serviço, preencha somente os campos obrigatórios
- Acesse **/planejamento**, o serviço que acabamos de criar não deve ser listado.
- Acesse **/serviços** novamente e termine de preencher os dados
- Volte para **planejamento** agora o serviço deve estar listado.
- Selecione um serviço

![](planejamento.png)

O status do serviço tem que ser alterado para pendente, e deve ser listado nos indicadores já com o valor convertido.

- Clique em sincronizar e em sincronizar esteira

Observe novamente o status de processamento e os indicadores, o status deve estar como processando e nos indicadores não existem mais valores pendentes.

- Acesse a esteira de serviços tomado **/servico-tomados**

![](esteira-servicos-tomados.png)

Deve ter sido criado um ticket, com um serviço adicionado.

- Volte para **/planejamento**
- Clique na caixa de seleção do serviço selecionado
- Confirme a operação

O status de processamento deve ter voltado para aberto, e não há mais nenhum dado preenchido nos indicadores

- Acesse novamente **/servicos-tomados**
- O serviço do ticket deve ter sido removido

## 🔧 Documentos cadastrais

📍 **Criação/edição**

**Requisitos**

- Listas com pelo menos um valor preenchido
- Pelo menos um Prestador adicionado

**Passo a passo**

- Acesse **/documentos-cadastrais**
- Selecione adicionar e preencha cada campo do formulário.
- Selecione um arquivo e fecha o dialog.

Deverá ser listado um documento cadastral no datagrid logo após o dialog fechar.

- Edite todos os campos no datagrid e atualize a página, verifique se nenhum dado foi perdido.
- Tente fazer o download do arquivo anexado, verifique se o nome do arquivo esta correto.
- Exclua o arquivo anexado.
- Anexe outro arquivo.
- Clique no botão de editar documento cadastral (ícone com lápis na coluna de ações) e edite todos os campos novamente. Atualize a página e certifique que nenhum dado foi perdido.

📍 **Exportação**

**Requisitos**

- Pelo menos um documento cadastral adicionado

**Passo a passo**

- Ainda no datagrid de documentos cadastrais, clique em **excel** e em **exportar datagrid**

![](excel-button.png)

- Selecione um local para salvar o arquivo

📍 **Exclusão**

**Requisitos**

- Pelo menos um documento cadastral adicionado

**Passo a passo**

- Clique em excluir (botão vermelho com ícone de lixeira)
- Confirme a exclusão
- O item deve sumir do datagrid
- Recarregue a página para garantir que não tem nada a ver com algum tipo de cache.

📍 **Importação**

**Requisitos**

**Passo a passo**

- Agora clique em Importar planilha

O usuário deve ser redirecionado para uma página de importação

- Clique em selecionar planilha e escolha o arquivo que separamos.

Deverá aparecer uma box com detalhes da importação:

![](importacao-documentos-cadastrais.png)

- Volte para **/documentos-cadastrais** e verifique se os campos informados na tabela de importação foram preenchidos corretamente.

📍 **Análise de documento cadastral**

**Requisitos**

- Pelo menos um documento cadastral adicionado
- Documento anexado ao documento cadastral
- Listas com pelo menos um valor preenchido

**Passo a passo**

- Se seu documento cadastral não tiver um arquivo anexado, anexe um arquivo. Isso deverá fazer com que surja um novo ícone no datagrid

![](analisar-documento-cadastral.png)

- Clique no ícone de analise de documento cadastral
- Clique em aprovar

O status de validação deve ter sido alterado para **aprovado**

- Altere o status no data grid para **pendente**
- Abra novamente o dialog de analise de documento cadastral
- Selecione o motivo de recusa e preencha os campos de observação
- Clique em reprovar

O status de validação deve ter sido alterado para **recusado**

## 🔧 Documentos fiscais

📍 **Criação/edição**

**Requisitos**

- Listas com pelo menos um valor preenchido
- Pelo menos um Prestador adicionado

**Passo a passo**

- Acesse **/documentos-fiscais**
- Selecione adicionar e preencha cada campo do formulário.
- Selecione um arquivo e feche o dialog.

Deverá ser listado um documento fiscal no datagrid logo após o dialog fechar.

- Edite todos os campos no datagrid e atualize a página, verifique se nenhum dado foi perdido.
- Tente fazer o download do arquivo anexado, verifique se o nome do arquivo esta correto.
- Exclua o arquivo anexado.
- Anexe outro arquivo.
- Clique no botão de editar documento fiscal (ícone com lápis na coluna de ações) e edite todos os campos novamente. Atualize a página e certifique que nenhum dado foi perdido.

📍 **Exportação**

**Requisitos**

- Pelo menos um documento fiscal adicionado

**Passo a passo**

- Ainda no datagrid de documentos fiscais, clique em **excel** e em **exportar datagrid**

![](excel-button.png)

- Selecione um local para salvar o arquivo

📍 **Exclusão**

**Requisitos**

- Pelo menos um documento fiscal adicionado

**Passo a passo**

- Clique em excluir (botão vermelho com ícone de lixeira)
- Confirme a exclusão
- O item deve sumir do datagrid
- Recarregue a página para garantir que não tem nada a ver com algum tipo de cache.

📍 **Importação**

**Requisitos**

**Passo a passo**

- Agora clique em Importar planilha

O usuário deve ser redirecionado para uma página de importação

- Clique em selecionar planilha e escolha o arquivo que separamos.

Deverá aparecer uma box com detalhes da importação:

![](importacao-documentos-fiscais.png)

- Volte para **/documentos-fiscais** e verifique se os campos informados na tabela de importação foram preenchidos corretamente.

## 🔧 Tickets

**Requisitos**

- Listas com pelo menos um valor preenchido
- Pelo menos um Prestador adicionado
- Pelo menos um serviço adicionado
- Pelo menos um documento documento fiscal adicionado

**Passo a passo**

- Em **/servicos-tomados** clique no botão de criar ticket
- Preencha o título
- Crie um novo Prestador com o formulário do ticket.
- Acesse /pessoas
- Verifique se há duas pessoas adicionadas
- Volte para /servicos-tomados
- Selecione outro Prestador
- Selecione um serviço (certifique se que existe um serviço com o Prestador selecionado no ticket)
- Remova o serviço
- Adicione novamente
- Selecione documento fiscal (certifique se que existe um documento fiscal com o Prestador selecionado no ticket)
- Remova documento fiscal
- Adicione anexo ao ticket
- Altere o status do ticket para trabalhando
- Aprove o ticket

Ao aprovar o ticket deve andar uma etapa e alterar o status novamente para aguardando-inicio

- Reprove o ticket

O ticket deve voltar uma etapa e alterar o status para revisão

- Aprove o ticket até etapa conta pagar omie

O ticket deve estar somente como leitura e não deve poder aprovar/reprovar.

## Filtros

Uma parte muito importante do sistema se consiste nos filtros, tanto da esteira, quanto do data grid, por isso torna-se muito importante testa-los de forma adequada.

📍 **Datagrid**

**Passo a passo**

- Selecione uma coleção, preencha cada filtro com o campo respectivo da coleção.

O exemplo a seguir foi realizado na coleção de Prestadores
![](exemplo-filtros.png)
fique atento pois se em algum momento não for listado nenhum item isso significa que o campo filtrado esta com algum problema.

- Limpe todos os filtros

**Campos de data**

- Os campos do tipo data aceitam > e < para verificar maior, menor ou igual a. Exemplo: **>01/02/2020** deve listar todos itens com data maior ou igual a **>01/02/2020** e **<01/02/2020** deve listar todas as data menores ou iguais a **<01/02/2020**

**Filtros globais**

- Os filtros globais do datagrid geralmente aceitam qualquer campo do data grid, então para testa-lo, preencha cada valor do datagrid no campo de pesquisa global.

## 🔧 Moedas

**Requisitos**

- Processo de ativação concluído

**Passo a passo**

Se tudo ocorreu bem, sua lista de moedas deve estar pre-preenchida, mas em moedas temo um botão para atualizar a cotação.

- Clique no botão para atualizar cotação de moeda, assim que você clicar o campo atualizado em deve ser alterado.
- Clique no botão de detalhes (o botão com ?).

Voce poderá ver os resultados de cada requisição que foi feita.

![](moedas.png)

## 🔧 Assistentes

**Requisitos**

- Processo de ativação concluído
- Doc custom devidamente configurado
- Api de integração com gpt configurado

**Passo a passo**

Da mesma forma que moedas o processo de ativação já cria por padrão alguns assistentes. Porém esses assistentes não estão com um assistente selecionado.

- Em **/assistentes**
- Clique na célula, para selecionar um assistente

Se não aparecer nenhuma opção de assistente para selecionar ou a aplicação esta com erro com relação a sincronização com doc custom, ou não há nenhum assistente configurado no doc custom.

O modulo de um assistente é se consiste do padrão esteira.entidade(caso tenha).direcao(caso tenha).etapa(ou geral se quiser configurar um assistente comum para todas etapas) ex:
![](assistentes.png)

No caso acima temos a esteira.etapa, já que não existe uma entidade na esteira de serviços tomados nem uma direção. O que é diferente das esteiras de integração por exemplo. Uma esteira de integração seria por exemplo: **integracao.pessoa.central_omie.requisicao**.

Mas não se preocupe todas as possibilidades de módulos já estão pre-preenchidas.
