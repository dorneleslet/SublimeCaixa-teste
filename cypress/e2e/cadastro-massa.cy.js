import { gerarClientes } from '../factories/clientesFactory.js'

describe('Página de cadastro de clientes', () => {
    beforeEach(() => {    
        cy.visit('http://127.0.0.1:8000/clientes/');
    })

    it('Deve cadastrar 20 clientes corretamente.', () => {
        for (let i = 0; i < 20; i++) { // Alterar aqui a quantidade de cadastro
            const cliente = gerarClientes();

            cy.get('[data-test="nome-cadastro"]').clear().type(cliente.nome);
            cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
            cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
            cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
            cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);

            cy.get('[data-test="btn-salvar"]').click();
            cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
        }
    })
})    
