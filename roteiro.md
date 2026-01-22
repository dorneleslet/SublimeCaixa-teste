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
2. o usuário permanece na tela de login.
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
| 2 | O usuário não preenche os campos "Nome Completo". | Aparece a mensagem "**Por favor, indique o nome do cliente.**". |
| 3 | O usuário não preenche o campo "Telefone". | Aparece a mensagem "**Por favor, indique um número para contato.**". |
| 4 | O usuário não preenche o campo "NIF". | Aparece a mensagem "**Por favor, indique o número de contribuinte.**" |
| 5 | O usuário não preenche o campo "Nascimento". | - |
| 6 | O usuário não preenche o campo "Email". | - |
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
| 3 | O usuário preenche o campo "Telefone" com o valor "555222111" da massa de dados. | - |
| 4 | O usuário preenche o campo "NIF" com o valor "333222111" da massa de dados (já existente). | Aparece a mensagem "**Cliente com este NIF já existe.**" |
| 5 | O usuário preenche o campo "Nascimento". | - |
| 6 | O usuário preenche o campo "Email". | - |
| 7 | O usuário clica no botão "Cadastrar". | Aparece a mensagen de erro. |
3. Não é possível fazer o cadastro do cliente com o número de nif já existente e o usuário permanece na tela de cadastro de clientes.

---

