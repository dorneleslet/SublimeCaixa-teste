// describe('Vericação de login', () => {
//   it('Deve carregar a página de login, preencher os campos e fazer o login com sucesso', () => {
//     cy.visit('http://127.0.0.1:8000/accounts/login/');
//     cy.get('#id_username').type('Teste');
//     cy.get('#id_password').type('Teste123456');
//     cy.get('.btn').click();
//     cy.visit('http://127.0.0.1:8000/clientes/');
//   })
// })

describe('Cadastrar novo cliente', () => {
  beforeEach(() => {
    cy.visit('https://sublimecaixa-teste.onrender.com/accounts/login/');
    cy.get('#id_username').type('Teste');
    cy.get('#id_password').type('Teste123456');
    cy.get('.btn').click();
  })
  it('Deve carregar a página de clientes, preencher os campos e cadastrar o cliente com sucesso', () => {
    cy.visit('https://sublimecaixa-teste.onrender.com/clientes/');
    cy.get('#nome').type('Cliente Teste');
    cy.get('#telefone').type('123456789');
    cy.get('#nif').type('555222126');
    cy.get('#nascimento').type('12101990');
    //cy.get('[data-test="email-cadastro"]').type('cliente@teste.com');
    //cy.contains('input', 'Cadastrar').click();
    cy.get('[data-test=btn-salvar]').click();
  
  })
})