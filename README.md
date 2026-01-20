Sistema de Caixa, Estoque e Gestão de Clientes

Este é um sistema interno desenvolvido para um salão de beleza, com foco em controle de caixa, gerenciamento de estoque e cadastro de clientes e serviços.  
O projeto serviu como prática para consolidar meus conhecimentos em Python (Django), JavaScript, HTML e CSS, além de reforçar habilidades importantes para QA, como organização de dados, validação de entradas e usabilidade.

## Funcionalidades
- Cadastro e edição de clientes (com fichas de acompanhamentos)  
- Cadastro e edição de serviços  
- Controle de caixa (registro e relatórios de vendas)  
- Gestão de estoque (entradas e saídas de produtos)  
- Interface amigável com formulários dinâmicos  

## Tecnologias Utilizadas
- Backend: Python + Django  
- Frontend: HTML, CSS, JavaScript  
- Banco de Dados: PostgreSQL  

## Estrutura do Projeto
- clientes/ → módulo de cadastro e edição de clientes  
- servicos/ → módulo de cadastro e edição de serviços  
- estoque/ → módulo de controle de produtos  
- caixa/ → módulo de registro de vendas 

## Aprendizados
Durante o desenvolvimento deste projeto, pude reforçar conhecimentos em:
- Organização de dados e lógica de programação  
- Integração frontend/backend  
- Experiência do usuário
- Criação e validação de regras de negócio  
- Manipulação e organização de dados  
- Testes práticos de interface e usabilidade  
- Identificação de cenários de erro e entradas inválidas  
- Atenção a detalhes em formulários e fluxos do sistema  

## Como executar o projeto
1. Clone este repositório:  
   git clone https://github.com/dorneleslet/SublimeCaixa.git
   
3. Crie e ative um ambiente virtual:
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

4. Instale as dependências:
pip install -r requirements.txt

5. Rode as migrações e inicie o servidor:
python manage.py migrate
python manage.py runserver

6. Acesse no navegador:
http://127.0.0.1:8000

Status do Projeto
Concluído – atualmente em uso no salão de beleza e disponível para melhorias futuras.

Desenvolvido por Letícia Dorneles – em transição de carreira para QA Tester.
Atualmente estudando CTFL (ISTQB), testes manuais e automação com Python.
