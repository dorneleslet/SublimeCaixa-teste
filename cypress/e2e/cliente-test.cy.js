// describe('Vericação de login', () => {
//   it('Deve carregar a página de login, preencher os campos e fazer o login com sucesso', () => {
//     cy.visit('http://127.0.0.1:8000/accounts/login/');
//     cy.get('#id_username').type('Teste');
//     cy.get('#id_password').type('Teste123456');
//     cy.get('.btn').click();
//     cy.visit('http://127.0.0.1:8000/clientes/');
//   })
// })

describe('Cadastrar novo cliente, serviço e realizar venda com sucesso', () => {
  beforeEach(() => {
    cy.visit('https://sublimecaixa-teste.onrender.com/clientes/');
    cy.login('Teste', 'Teste123456');
  })
  it('Deve carregar a página de clientes, preencher os campos e cadastrar o cliente com sucesso', () => {
   
    cy.visit('https://sublimecaixa-teste.onrender.com/clientes/');
    cy.get('#nome').type('Cliente Teste');
    cy.get('#telefone').type('123456789');
    cy.get('#nif').type('587458745');
    cy.get('[data-test=btn-salvar]').click();
    cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
  })

  it('Acessar a página de serviços e cadastrar um serviço com sucesso', () => {
    cy.visit('https://sublimecaixa-teste.onrender.com/servicos/novo/');
    cy.get('[data-test="servico-cadastro"]').type('Serviço Teste');
    cy.get('[data-test="preco-cadastro"]').type('45');
    cy.get('[data-test="botao-cadastro"]').click();
    cy.contains('Serviço cadastrado com sucesso!').should('be.visible');
  })

  it('Acessar a página de caixa e realizar uma venda com sucesso', () => {
    cy.visit('https://sublimecaixa-teste.onrender.com/caixa/');
    cy.get('[data-test="buscar_cliente"]').type('Leticia Dorneles');
    cy.contains('.list-group-item', 'Leticia Dorneles').click();
    cy.get('[data-test="buscar_servico"]').type('Serviço Teste').click();
    cy.contains('#lista_servicos > :nth-child(1)', 'Serviço Teste').click();
    cy.get('[data-test="profissional"]').type('Joana');
    cy.get('[data-test="desconto"]').type('10');
    cy.get('[data-test="sinal"]').type('10');
    cy.get('[data-test="fatura"]').select('Sim');
    cy.get('[data-test="pagamento"]').select('Dinheiro');
    cy.get('[data-test="finalizar-venda"]').click();
    cy.contains('Venda registrada com sucesso!').should('be.visible');
  })
})