import { gerarClientes } from '../factories/clientesFactory.js'

describe('Fluxo E2E completo de venda', () => {
  it('Deve cadastrar cliente, serviço e realizar uma venda com sucesso', () => {
    const cliente = gerarClientes();
    const nomeCliente = `Cliente ${Date.now()}`;
    const nomeServico = `Servico ${Date.now()}`;
    const nomeProduto = `Produto ${Date.now()}`;

    // Clientes
    cy.visit('http://127.0.0.1:8000/clientes/');

    cy.get('[data-test="nome-cadastro"]').clear().type(nomeCliente);
    cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
    cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
    cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
    cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);
    
    cy.get('[data-test="btn-salvar"]').click();
    cy.contains('Cliente cadastrado com sucesso!').should('be.visible');

    // Serviços
    cy.visit('http://127.0.0.1:8000/servicos/novo/');

    cy.get('[data-test="nome-servico-cadastro"]').type(nomeServico);
    cy.get('[data-test="preco-servico-cadastro"]').type('45');

    cy.get('[data-test="btn-cadastro-servico"]').click();
    cy.contains('Serviço cadastrado com sucesso!').should('be.visible');

    // Estoque
    cy.visit('http://127.0.0.1:8000/estoque/');

    cy.get('[data-test="nome-produto-cadastro"]').type(nomeProduto);
    cy.get('[data-test="quantidade-produto-cadastro"]').type('6');
    cy.get('[data-test="preco-produto-cadastro"]').clear().type('1499');
    cy.get('[data-test="descricao-produto-cadastro"]').type('Específico para cabelos loiros');

    cy.get('[data-test="btn-cadastro-produto"]').click();
    cy.contains('Produto cadastrado com sucesso!').should('be.visible');


    // Caixa - realizar a venda
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar_cliente"]').type(nomeCliente);
    cy.contains(nomeCliente).click();

    cy.get('[data-test="buscar_servico"]').type(nomeServico);
    cy.contains(nomeServico).click();

    cy.get('[data-test="buscar-produto"]').type(nomeProduto);
    cy.contains(nomeProduto).click();

    cy.get('[data-test="profissional"]').type('Joana');
    cy.get('[data-test="desconto"]').type('10');
    cy.get('[data-test="sinal"]').type('10');
    cy.get('[data-test="fatura"]').select('Sim');
    cy.get('[data-test="pagamento"]').select('Dinheiro');

    cy.get('[data-test="finalizar-venda"]').click();
    cy.contains('Venda registrada com sucesso!').should('be.visible');
  })

  it('Deve cadastrar cliente e validar que cliente criado pode ser usado no caixa.', () => {
    const cliente = gerarClientes();
    const nomeCliente = `Cliente ${Date.now()}`;

    // Clientes
    cy.visit('http://127.0.0.1:8000/clientes/');

    cy.get('[data-test="nome-cadastro"]').clear().type(nomeCliente);
    cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
    cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
    cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
    cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);
    
    cy.get('[data-test="btn-salvar"]').click();
    cy.contains('Cliente cadastrado com sucesso!').should('be.visible');

    // Caixa - validar cliente cadastrado
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar_cliente"]').type(nomeCliente);
    cy.contains(nomeCliente).click();
  })

  it('Deve criar produto com estoque 0 e tentar realizar venda', () => {
    const cliente = gerarClientes();
    const nomeProduto = `Produto ${Date.now()}`;

    // Estoque
    cy.visit('http://127.0.0.1:8000/estoque/');

    cy.get('[data-test="nome-produto-cadastro"]').type(nomeProduto);
    cy.get('[data-test="quantidade-produto-cadastro"]').type('6');
    cy.get('[data-test="preco-produto-cadastro"]').clear().type('1499');
    cy.get('[data-test="descricao-produto-cadastro"]').type('Específico para cabelos loiros');

    cy.get('[data-test="btn-cadastro-produto"]').click();
    cy.contains('Produto cadastrado com sucesso!').should('be.visible');


    // Caixa - realizar a venda
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar-produto"]').type(nomeProduto);
    cy.contains(nomeProduto).click();

    cy.get('[data-test="profissional"]').type('Joana');
    cy.get('[data-test="fatura"]').select('Sim');
    cy.get('[data-test="pagamento"]').select('Dinheiro');

    cy.get('[data-test="finalizar-venda"]').click();
    cy.contains(`O produto "${nomeProduto}" está sem estoque disponível e não pode ser vendido.`).should('be.visible');
  })

  it('Deve criar serviço, editar preço e validar o novo preço no caixa.', () => {
    cy.visit('http://127.0.0.1:8000/estoque/');
    
  })
})