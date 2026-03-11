import { gerarClientes } from '../factories/clientesFactory.js'

// describe('Página de cadastro de clientes', () => {
//     beforeEach(() => {    
//         cy.visit('http://127.0.0.1:8000/clientes/');
//     })

//     it('Criando novo cliente com campos obrigatórios.', () => {
//         const cliente = gerarClientes();

//         cy.get('[data-test="nome-cadastro"]').clear().type(cliente.nome);
//         cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
//         cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
        
//         cy.get('[data-test="btn-salvar"]').click();
//         cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
//     })

//     it('Criando novo cliente com todos os campos preenchidos.', () => {
//         const cliente = gerarClientes();

//         cy.get('[data-test="nome-cadastro"]').clear().type('Leticia Dorneles');
//         cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
//         cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
//         cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
//         cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);
        
//         cy.get('[data-test="btn-salvar"]').click();
//         cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
//     })

//     it('Criando novo cliente com campos obrigatórios e nascimento.', () => {
//         const cliente = gerarClientes();

//         cy.get('[data-test="nome-cadastro"]').clear().type('Cliente Teste');
//         cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
//         cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
//         cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
        
//         cy.get('[data-test="btn-salvar"]').click();
//         cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
//     })

//     it('Criando novo cliente com campos obrigatórios e email.', () => {
//         const cliente = gerarClientes();

//         cy.get('[data-test="nome-cadastro"]').clear().type(cliente.nome);
//         cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
//         cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
//         cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);
        
//         cy.get('[data-test="btn-salvar"]').click();
//         cy.contains('Cliente cadastrado com sucesso!').should('be.visible');
//     })

//     it('Atualizando dados de cadastro do cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-editar"]').click();
//         cy.get('[data-test="email-edicao"]').click().clear().type('leticiadorneles@email.com');

//         cy.get('[data-test="btn-salvar-edicao"]').click();
//         cy.contains('Dados alterados com sucesso!').should('be.visible');
//     })
    
//     it('Excluindo cadastro do cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Cliente Teste').click();
//         cy.contains('Cliente Teste').click();

//         cy.get('[data-test="btn-excluir"]').click();

//         cy.get('[data-test="btn-confirmar"]').click();
//         cy.contains('Cliente excluído com sucesso!').should('be.visible');
//     })

//     it('Adicionando ficha técnica com todos os campos preenchidos ao cadastro de cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-ficha-cliente"]').click();
//         cy.get('#fichaCliente').should('be.visible');

//         cy.get('[data-test="data-proced"]').type('05/03/2026');
//         cy.get('[data-test="profissional"]').type('Sara');
//         cy.get('[data-test="valor-ficha"]').type(5500);
//         cy.get('[data-test="procedimento"]').type('Corte e Finalização');
//         cy.get('[data-test="homecare"]').type('Kit shampoo e máscara');
//         cy.get('[data-test="observacao"]').type('Cliente tem pouco cabelo, tratamento de oferta.');

//         cy.get('[data-test="btn-adicionar-ficha"]').click();
//         cy.contains('Ficha do cliente adicionada com sucesso!').should('be.visible');
//     })

//     it('Adicionando ficha técnica com apenas com campos obrigatórios ao cadastro de cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-ficha-cliente"]').click();
//         cy.get('#fichaCliente').should('be.visible');

//         cy.get('[data-test="data-proced"]').type('05/03/2026');
//         cy.get('[data-test="valor-ficha"]').type(2500);
//         cy.get('[data-test="homecare"]').type('Kit shampoo, máscara e óleo finalizador');

//         cy.get('[data-test="btn-adicionar-ficha"]').click();
//         cy.contains('Ficha do cliente adicionada com sucesso!').should('be.visible');
//     })

//     it('Editando ficha técnica de cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-ficha-cliente"]').click();
//         cy.get('#fichaCliente').should('be.visible');

//         cy.get('[data-test="btn-editar-ficha"]').first().click();
//         cy.get('[data-test="edit-ficha-observacao"]').type('Tratamento em casa');;

//         cy.get('[data-test="btn-salvar-edit-ficha"]').click(); 
//     })

//     it('Excluindo ficha técnica de cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-ficha-cliente"]').click();
//         cy.get('#fichaCliente').should('be.visible');

//         cy.get('[data-test="btn-excluir-ficha"]').first().click();
//     })

//     it('Cancelando exclusão de ficha técnica de cliente.', () => {
//         cy.get('[data-test="btn-atualizar-cliente"]').click();

//         cy.get('[data-test="barra-pesquisa-clientes"]').click().type('Leticia Dorneles').click();
//         cy.contains('Leticia Dorneles').click();

//         cy.get('[data-test="btn-ficha-cliente"]').click();
//         cy.get('#fichaCliente').should('be.visible');

//         cy.get('[data-test="btn-excluir-ficha"]').first().click();
//         cy.on('window:confirm', () => false);
//     })
// })

// describe('Página de cadastro de serviços', () => {
//     beforeEach(() => {    
//         cy.visit('http://127.0.0.1:8000/servicos/novo');
//     })

//     it('Criando novo serviço.', () =>{
//         cy.get('[data-test="nome-servico-cadastro"]').type('Corte e Finalização');
//         cy.get('[data-test="preco-servico-cadastro"]').type('45,99');

//         cy.get('[data-test="btn-cadastro-servico"]').click();
//         cy.contains('Serviço cadastrado com sucesso!').should('be.visible');
//     })

//     it ('Editando serviço cadastrado.', () => {
//         cy.get('[data-test="btn-editar-servico"]').click();
//         cy.get('[data-test="barra-pesquisa-servicos"]').type('Corte e Finalização');
//         cy.contains('Corte e Finalização').first().click();
//         cy.get('[data-test="preco-servico-edicao"]').type('50,00');

//         cy.get('[data-test="btn-salvar-edicao"]').click();
//         cy.contains('Dados alterados com sucesso!').should('be.visible');
//     })

//     it ('Excluindo serviço cadastrado.', () => {
//         cy.get('[data-test="btn-editar-servico"]').click();
//         cy.get('[data-test="barra-pesquisa-servicos"]').type('Corte e Finalização');
//         cy.contains('Corte e Finalização').first().click();

//         cy.get('[data-test="btn-excluir-servico"]').click();
//         cy.get('[data-test="btn-confirmar-excluir-servico"]').click();

//         cy.contains('Serviço excluído com sucesso!').should('be.visible');
//     })
// })

// describe('Página de cadastro de produtos', () => {
//     beforeEach(() => {
//         cy.visit('http://127.0.0.1:8000/estoque/');
//     })

//     it ('Cadastrando produto no estoque.', () => {
//         cy.get('[data-test="nome-produto-cadastro"]').type('Shampoo');
//         cy.get('[data-test="quantidade-produto-cadastro"]').type('6');
//         cy.get('[data-test="preco-produto-cadastro"]').clear().type('1499'); // AJUSTAR MÁSCARA PARA INSERIR VALOR CORRETO
//         cy.get('[data-test="descricao-produto-cadastro"]').type('Específico para cabelos loiros');

//         cy.get('[data-test="btn-cadastro-produto"]').click();
//         cy.contains('Produto cadastrado com sucesso!').should('be.visible');
//     })

//     it ('Editando produto no estoque.', () => {
//         cy.get('[data-test="btn-editar-produto"]').click();

//         cy.get('[data-test="barra-pesquisa-produtos"]').type('Shampoo');
//         cy.contains('Shampoo').first().click();

//         cy.get('[data-test="adcQuantidade-produto-edicao"]').type('3');

//         cy.get('[data-test="btn-salvar-edicao"]').click();
//         cy.contains('Produto atualizado com sucesso!');
        
//     })

//     it ('Excluindo produto no estoque.', () => {
//         cy.get('[data-test="btn-editar-produto"]').click();
//         cy.get('[data-test="barra-pesquisa-produtos"]').type('Shampoo');
//         cy.contains('Shampoo').first().click();

//         cy.get('[data-test="btn-excluir-produto"]').click();
//         cy.get('[data-test="btn-confirmar-excluir-produto"]').click();
//        // cy.contains('Produto excluído com sucesso!').should('be.visible'); //ADICIONAR MENSAGEM DE EXCLUSÃO NO SISTEMA
//     })

// })

describe('Página do caixa principal', () => {
    beforeEach(() => {
        cy.visit('http://127.0.0.1:8000/caixa/')
    })

    it ('Realizando uma venda com todos os campos preenchidos.', () => {
        cy.get('[data-test="buscar_cliente"]').type('Leticia Dorneles');
        cy.contains('Leticia Dorneles').first().click();

        
    })

})


