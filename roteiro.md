# 📄 Documentação de Testes - Sublime Caixa

## Ambiente e Dados de Teste

### URL do Sistema
https://sublimecaixa.onrender.com/accounts/login/

-**Ambiente de Testes:**``



### 🔗 Massa de Dados: Usuário de login
| Campo | Valor |
| --- | --- |
| **Usuário** | Teste |
| **Senha** | Teste123456 |

### 👤 Massa de Dados: Cadastro de cliente
| Campo | Valor |
| --- | --- |
| **Nome** | Joana Maria Ferreira |
| **Telefone** | 333222111 |
| **NIF** | 333222111 |
| **Nascimento** | 12101993 |
| **Email** | joana@email.com |

### ✂️ Massa de Dados: Cadastro de serviço
| Campo | Valor |
| --- | --- |
| **Nome** | Corte e Finalização |
| **Preço** | `45.99` |

### 🧴 Massa de Dados: Cadastro de produtos
| Campo | Valor |
| --- | --- |
| **Nome** | Shampoo |
| **Quantidade** | 3 |
| **Preço** | `15.99` |
| **Descrição** | Shampoo para loiras |

### 💰 Massa de Dados: Realizar venda
| Campo | Valor |
| --- | --- |
| **Cliente** | Joana Maria Ferreira |
| **Serviços** | Corte e Finalização |
| **Produtos** | Shampoo |
| **Profissional** | Sara |
| **Desconto** | 3 |
| **Sinal** | 10 |
| **Fatura** | Sim |
| **Pagamento** | Mbway |
| **Notas** | Tratamento de oferta |

---

## 📑 Casos de Teste: Login

---

### CT001: Login Sistema de Caixa Sublime com Sucesso (Completo)

### **Objetivo** 

Autenticação de uauário, validar o fluxo de login bem-sucedido.

### **Pré-condições**

1. O administrador precisa ter o usuário cadastrado no sistema.
2. O usuário possui dados de login válidos.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de acesso do sistema. | Deve exibir uma tela com campos de usuário e senha. |
| 2 | O usuário preenche o campo "Usuário" com o valor "Teste". | - |
| 3 | O usuário preenche o campo "Senha" com o valor "Teste123456". | - |
| 4 | O usuário clica no botão "Login". | O usuário é direcionado para a página inicial do sistema. |
3. O usuário é redirecionado para a página do caixa que é a página inicial do sistema.

---

### CT002: Login inválido ao Sistema de Caixa Sublime (Dados de login inválidos)

### **Objetivo**

Validar o tratamento de erro do sistema quando um login é inválido.

### **Pré-condições**

1. O usuário NÃO possui dados de login válidos.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de acesso do sistema. | Deve exibir uma tela com campos de usuário e senha. |
| 2 | O usuário preenche o campo "Usuário" com o valor "Joana". | - |
| 3 | O usuário preenche o campo "Senha" com o valor "TesteErro". | - |
| 4 | O usuário clica no botão "Login". | O acesso é recusado. |
2. O usuário permanece na tela de login.
3. Deve ser exibida a seguinte mensagem: "**Por favor, entre com um usuário e senha corretos. Note que ambos os campos diferenciam maiúsculas e minúsculas.**"

---

## 📑 Casos de Teste: Cliente

---

### CT003: Cadastro de cliente com Sucesso (Completo)

### **Objetivo** 

Validar o fluxo de cadastro de cliente bem-sucedido.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Joana Maria Ferreira" da massa de dados. | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "333222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados. | - |
| 5 | O usuário preenche o campo "Nascimento" com o valor "12101993" da massa de dados. | - |
| 6 | O usuário preenche o campo "Email" com o valor "joana@email.com" da massa de dados. | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece uma mensagem de sucesso "**Cliente cadastrado com sucesso!**" |
3. A página é atualizada e o usuário permanece na tela de cadastro de clientes.

---

### CT004: Cadastro de cliente sem os dados obrigatórios (Fluxo de cadastro sem dados obrigatórios)

### **Objetivo** 

Validar o fluxo de cadastro de cliente sem os dados obrigatórios, nome, telefone e nif.

### **Pré-condições**

1. O usuário não possui os dados para cadastro do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário NÃO preenche os campos "Nome Completo". | Aparece a mensagem "**Por favor, indique o nome do cliente.**". |
| 3 | O usuário NÃO preenche o campo "Telefone". | Aparece a mensagem "**Por favor, indique um número para contato.**". |
| 4 | O usuário NÃO preenche o campo "NIF". | Aparece a mensagem "**Por favor, indique o número de contribuinte.**" |
| 5 | O usuário NÃO preenche o campo "Nascimento". | - |
| 6 | O usuário NÃO preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece as mensagens de erro. |
2. Não é possível fazer o cadastro do cliente sem os campos obrigatórios e o usuário permanece na tela de cadastro de clientes.

---

### CT005: Cadastro de cliente com NIF já existente

### **Objetivo** 

Validar o fluxo de cadastro de cliente utilizando o número de NIF de outro cliente cadastrado.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Teresa Maria Ferreira". | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "333222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados (já existente). | Aparece a mensagem "**Cliente com este NIF já existe.**" |
| 5 | O usuário preenche o campo "Nascimento". | - |
| 6 | O usuário preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagem de erro. |
3. Não é possível fazer o cadastro do cliente com o número de nif já existente e o usuário permanece na tela de cadastro de clientes.

---

### CT006: Cadastro de cliente com telefone com menos de 10 caracteres

### **Objetivo** 

Validar o fluxo de cadastro de cliente utilizando um número de telefone com menos de 10 caracteres, ex: (+351) 1234567.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Joana Maria Ferreira" da massa de dados. | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "1234567". | Aparece a mensagem "**Por favor, indique um número para contato.**" |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados. | - |
| 5 | O usuário preenche o campo "Nascimento". | - |
| 6 | O usuário preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagem de erro. |
3. Não é possível fazer o cadastro do cliente com o número de telefone com menos de 10 caracteres ou mais 15 caracteres e o usuário permanece na tela de cadastro de clientes.

---

### CT007: Cadastro de cliente com a data de nascimento inválida maior que o ano atual

### **Objetivo** 

Validar o fluxo de cadastro de cliente utilizando uma data de nascimento inválida.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Joana Maria Ferreira" da massa de dados. | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "333222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados. | - |
| 5 | O usuário preenche o campo "Nascimento" com o valor "12102065". | Aparece a mensagem "**O ano de nascimento não pode ser maior que ~ano atual~.**" |
| 6 | O usuário preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagem de erro. |
3. Não é possível fazer o cadastro do cliente com o nascimento com data maior que o ano atual e o usuário permanece na tela de cadastro de clientes.

---
### CT008: Cadastro de cliente com a data de nascimento inválida com o formato de data inválido

### **Objetivo** 

Validar o fluxo de cadastro de cliente utilizando uma data de nascimento inválida.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Joana Maria Ferreira" da massa de dados. | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "333222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados. | - |
| 5 | O usuário preenche o campo "Nascimento" com o valor "65854785". | Aparece a mensagem "**Data inválida. Use o formato DD/MM/AAAA.**" |
| 6 | O usuário preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagem de erro. |
3. Não é possível fazer o cadastro do cliente com o nascimento com uma data diferente de dia (1-31), mês (1-12) e ano (0001-ano atual) e o usuário permanece na tela de cadastro de clientes.

---

### CT009: Cadastro de cliente com o email inválido

### **Objetivo** 

Validar o fluxo de cadastro de cliente utilizando um email inválida.

### **Pré-condições**

1. O usuário possui os dados para cadastro do cliente.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. | Deve exibir uma tela com campos de nome, telefone, nif, nascimento e email. |
| 2 | O usuário preenche o campo "Nome Completo" com o valor "Joana Maria Ferreira" da massa de dados. | - |
| 3 | O usuário preenche o campo "Telefone" com o valor "333222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados. | - |
| 5 | O usuário NÃO preenche o campo "Nascimento". | - |
| 6 | O usuário preenche o campo "Email" com o valor "joana.com" ou "joana@". | Aparece a mensagem "**Inclua um "@" no endereço de email.**" ou "**Insira uma parte após "@".**" |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagen de erro. |
3. Não é possível fazer o cadastro do cliente com o email com formato inválido e o usuário permanece na tela de cadastro de clientes.

---

### CT010: Edição de cliente com Sucesso (Completo)

### **Objetivo** 

Validar o fluxo de edição do cadastro de cliente bem-sucedido.

### **Pré-condições**

1. O usuário possui os dados para editar o cadastro do cliente.
2. O usuário possui dados válidos para editar o cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário altera o nome para "Joana Maria Ferreira de Souza". | - |
| 5 | O usuário clica no botão "Salvar alterações". | Aparece uma mensagem de sucesso "**Dados alterados com sucesso!**" |
3. A página é atualizada e o usuário volta para a tela de atualizar clientes.

---

### CT011: Edição de cliente sem os dados obrigatórios (Fluxo de edição de cadastro sem dados obrigatórios)

### **Objetivo** 

Validar o fluxo de cadastro de cliente sem os dados obrigatórios, nome, telefone e nif.

### **Pré-condições**

1. O usuário não possui os dados para edição de cadastro do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário limpa os campos "Nome Completo". | Aparece a mensagem "**Por favor, indique o nome do cliente.**". |
| 5 | O usuário limpa o campo "Telefone". | Aparece a mensagem "**Por favor, indique um número para contato.**". |
| 6 | O usuário limpa o campo "NIF". | Aparece a mensagem "**Por favor, indique o número de contribuinte.**" |
| 7 | O usuário limpa o campo "Nascimento". | - |
| 8 | O usuário limpa preenche o campo "Email". | - |
| 9 | O usuário clica no botão "Salvar alterações". | Aparece as mensagens de erro. |
2. Não é possível fazer a edição do cadastro do cliente sem os campos obrigatórios e o usuário permanece na tela de edição de cadastro de clientes.

---

### CT012: Edição de cliente com NIF já existente

### **Objetivo** 

Validar o fluxo de edição de cadastro de cliente com um nif já cadastrado anteriormente.

### **Pré-condições**

1. O usuário possui os dados para edição de cadastro do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário altera o campo "NIF" com o valor "333222111" da massa de dados (já existente). | Aparece a mensagem "**Já existe um cliente com este NIF.**" |
| 5 | O usuário clica no botão "Salvar alterações". | Aparece a mensagem de erro. |
2. Não é possível fazer a edição de cadastro do cliente com o número de nif já existente e o usuário permanece na tela de edição de cadastro de clientes.

---

### CT013: Exclusão de cliente com sucesso (Completo)

### **Objetivo** 

Validar o fluxo de exclusão de cliente na edição de cadastro.

### **Pré-condições**

1. O usuário possui os dados do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário clica no botão "Excluir". | Aparece um pop-up com a mensagem "**Tem certeza que deseja excluir este cliente?**", um botão de "Excluir" e um botão de "Cancelar". |
| 5 | O usuário clica no botão "Excluir". | A página é atualizada e retorna para a listagem de clientes cadastrados. |
2. O cliente nunca é excluído do banco de dados, fica como oculto.

---

### CT014: Adicionar ficha técnica de cliente com sucesso (Completo)

### **Objetivo** 

Validar o fluxo de adicionar ficha técnica de cliente na edição de cadastro.

### **Pré-condições**

1. O usuário possui os dados do cliente.
2. O usuário possui as informações técnicas para preenchimento da ficha técnica do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário clica no botão "Ver ficha do cliente". | Deve abrir uma tela com novos campos de adicionar nova ficha, tem campos de data do procedimento, profissional que realizou, valor pago, procedimento realizado, linha home care, observações e um botão "Adicionar ficha", abaixo tem um campo de histórico do cliente, com as fichas já adicionadas. | 
| 5 | O usuário preenche o campo "Data do procedimento" com o valor "12102022". | - |
| 6 | O usuário preenche o campo "Profissional" com o valor "Sara". | - |
| 7 | O usuário preenche o campo "Valor pago" com o valor "150". | - |
| 8 | O usuário preenche o campo "Procedimento realizado" com o valor "Tratamento Sublime". | - |
| 9 | O usuário preenche o campo "Linha home care" com o valor "Kit Absolut Repair Molecular - Shampoo e Máscara". | - |
| 10 | O usuário preenche o campo "Observações" com o valor "Tem 3 adicionais". | - |
| 11 | O usuário clica no botão "Adicionar ficha". | Aparece uma mensagem de sucesso "**Ficha do cliente adicionada com sucesso!**" e abaixo mostra a ficha no histórico do cliente com um botão de "Excluir". |
3. A ficha técnina do cliente é adicionada ao histórico do cliente.

---

### CT015: Adicionar ficha técnica de cliente sem preencher os campos obrigatórios

### **Objetivo** 

Validar o fluxo de adicionar ficha técnica de cliente na edição de cadastro sem preencher os campos obrigatórios.

### **Pré-condições**

1. O usuário possui os dados do cliente.
2. O usuário não possui as informações técnicas para preenchimento da ficha técnica do cliente. 

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário clica no botão "Ver ficha do cliente". | Deve abrir uma tela com novos campos de adicionar nova ficha, tem campos de data do procedimento, profissional que realizou, valor pago, procedimento realizado, linha home care, observações e um botão "Adicionar ficha", abaixo tem um campo de histórico do cliente, com as fichas já adicionadas. | 
| 5 | O usuário NÃO preenche o campo "Data do procedimento". | - |
| 6 | O usuário preenche o campo "Profissional" com o valor "Sara". | - |
| 7 | O usuário NÃO preenche o campo "Valor pago". | - |
| 8 | O usuário preenche o campo "Procedimento realizado" com o valor "Tratamento Sublime". | - |
| 9 | O usuário preenche o campo "Linha home care" com o valor "Kit Absolut Repair Molecular - Shampoo e Máscara". | - |
| 10 | O usuário preenche o campo "Observações" com o valor "Tem 3 adicionais". | - |
| 11 | O usuário clica no botão "Adicionar ficha". | Aparece um alerta de erro "**Preencha todos os campos obrigatórios.**" com um botão "Ok". |
3. Não é possível adicionar uma nova ficha técnica sem preencher os campos obrigatórios e o usuário permanece na tela de edição decadastro de clientes.

---

### CT016: Excluir ficha técnica de cliente no histórico do cliente

### **Objetivo** 

Validar o fluxo de exclusão de ficha técnica de cliente na edição de cadastro.

### **Pré-condições**

1. O usuário possui os dados do cliente.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de cliente do sistema. Vai no dashboard "Atualizar clientes" | Deve exibir uma tela com uma barra de pesquisa e abaixo listagem de clientes cadastrados. |
| 2 | O usuário pesquisa "Joana" na barra de pesquisa. | Todos os clientes com o nome "Joana" serão listados na tela. |
| 3 | O usuário clica no cliente "Joana Maria Ferreira". | Deve exibir uma tela com um botão "Voltar para lista de clientes", os campos de nome, telefone, nif, nascimento, email, um botão de "Salvar alterações" e um botão de "Excluir", abaixo tem um botão de "Ver ficha do cliente".|
| 4 | O usuário clica no botão "Ver ficha do cliente". | Deve abrir uma tela com novos campos de adicionar nova ficha, tem campos de data do procedimento, profissional que realizou, valor pago, procedimento realizado, linha home care, observações e um botão "Adicionar ficha", abaixo tem um campo de histórico do cliente, com as fichas já adicionadas. | 
| 5 | O usuário na parte de histórico do cliente clica no botão "Excluir". | Aparece um alerta de erro "**Tem certeza que deseja excluir esta ficha?**" com um botão de "Cancelar" e um botão de "Ok". |
| 6 | O usuário clica no botão "Ok". | - |
3. A ficha técnica é excluída do histórico do cliente.

---

## 📑 Casos de Teste: Serviço

---

### CT017: Cadastro de serviço com Sucesso (Completo)

### **Objetivo** 

Validar o fluxo de cadastro de serviço bem-sucedido.

### **Pré-condições**

1. O usuário possui os dados para cadastro do serviço.
2. O usuário possui dados válidos para cadastro.

| Passo | Ação | Resultado Esperado |
| --- | --- | --- |
| 1 | O usuário acessa a página de serviço do sistema. | Deve exibir uma tela com campos de nome do serviço e preço. |
| 2 | O usuário preenche o campo "Nome do Serviço" com o valor "Corte e Finalização" da massa de dados. | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece uma mensagem de sucesso "**Serviço cadastrado com sucesso!**" |
3. A página é atualizada e o usuário permanece na tela de cadastro de serviços.

---


