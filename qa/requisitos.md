# Requisitos Funcionais - Sublime Caixa

## RF001 - Autenticação de Usuário

O sistema deve permitir que usuários autenticados acessem o sistema através de login utilizando usuário e senha válidos.

### Regras de Negócio

* Usuário e senha são obrigatórios.
* Credenciais inválidas devem impedir o acesso.
* O sistema deve exibir mensagem de erro em caso de falha de autenticação.

---

## RF002 - Cadastro de Clientes

O sistema deve permitir cadastrar novos clientes.

### Campos

* Nome
* Telefone
* NIF
* Data de nascimento
* E-mail

### Regras de Negócio

* Nome é obrigatório.
* Telefone é obrigatório.
* NIF é obrigatório.
* O NIF deve ser único.
* O nome deve possuir no máximo 50 caracteres.

---

## RF003 - Edição de Clientes

O sistema deve permitir alterar os dados de clientes já cadastrados.

### Regras de Negócio

* Apenas clientes existentes podem ser editados.
* Os dados alterados devem ser persistidos no banco de dados.

---

## RF004 - Exclusão de Clientes

O sistema deve permitir remover clientes cadastrados.

### Regras de Negócio

* O sistema deve solicitar confirmação antes da exclusão.
* Clientes excluídos não devem aparecer nas pesquisas.

---

## RF005 - Cadastro de Serviços

O sistema deve permitir cadastrar serviços.

### Campos

* Nome
* Valor

### Regras de Negócio

* Nome é obrigatório.
* Valor é obrigatório.
* O valor deve ser maior que zero.

---

## RF006 - Controle de Estoque

O sistema deve permitir gerenciar produtos do estoque.

### Regras de Negócio

* Registrar entradas de produtos.
* Registrar saídas de produtos.
* Atualizar quantidade disponível.
* Impedir estoque negativo.

---

## RF007 - Registro de Vendas

O sistema deve permitir registrar vendas.

### Regras de Negócio

* A venda deve possuir ao menos um item (serviço ou produto).
* O valor total deve ser calculado automaticamente.
* A forma de pagamento deve ser informada.
