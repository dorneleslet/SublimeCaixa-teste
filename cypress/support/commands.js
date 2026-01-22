Cypress.Commands.add('login', (email, senha) => { 
    cy.get('#id_username').type('Teste');
    cy.get('#id_password').type('Teste123456');
    cy.get('.btn').click();
 })

Cypress.Commands.add('cadastro', (email, senha) => { 
    cy.get('#nome').type('Cliente Teste');
    cy.get('#telefone').type('123456789');
    cy.get('#nif').type('555222126');
    cy.get('#nascimento').type('12101990');
    //cy.get('[data-test="email-cadastro"]').type('cliente@teste.com');
    //cy.contains('input', 'Cadastrar').click();
    cy.get('[data-test=btn-salvar]').click();
  })

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })