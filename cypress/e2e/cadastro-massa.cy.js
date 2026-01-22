import { usuarios } from '../fixtures/usuarios.json'

describe('Página de cadastro de clientes', () => {
    beforeEach(() => {
        cy.visit('https://sublimecaixa-teste.onrender.com/accounts/login/');
        cy.login('Teste', 'Teste123456');    
        cy.visit('https://sublimecaixa-teste.onrender.com/clientes/');
    })
    usuarios.forEach(usuario => {
        it('Deve preencher os campos do cadastro de clientes corretamente.', () => {
            cy.get('#nome').clear().type(usuario.nome);
            cy.get('#telefone').clear().type(usuario.telefone);
            cy.get('#nif').clear().type(usuario.nif);
            //cy.get('#nascimento').clear().type(usuario.nascimento);
            //cy.get('[data-test="email-cadastro"]').clear().type(usuario.email);
            cy.get('[data-test=btn-salvar]').click();
            cy.contains('')
        
        })
    })    
})