import { gerarClientes } from '../factories/clientesFactory.js'

describe('Página de cadastro de clientes', () => {
    beforeEach(() => {    
        cy.visit('http://127.0.0.1:8000/clientes/');
    })
    gerarClientes.forEach(gerarClientes => {
        it('Deve preencher os campos do cadastro de clientes corretamente.', () => {
            cy.get('[data-test="nome-cadastro"]').clear().type(chance.nome);
            cy.get('[data-test="telefone-cadastro"]').clear().type(chance.telefone);
            cy.get('[data-test="nif-cadastro"]').clear().type(chance.nif);
            //cy.get('[data-test="nascimento-cadastro"]').clear().type(chance.nascimento);
            //cy.get('[data-test="email-cadastro"]').clear().type(chance.email);
            cy.get('[data-test="btn-salvar"]').click();
            cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
        
        
        })
    })    
})