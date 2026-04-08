import { gerarClientes } from '../factories/clientesFactory.js'

describe('E2E - Venda', () => {
  it('Deve cadastrar cliente, serviço, produto e realizar uma venda com sucesso', () => {
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
    cy.get('[data-test="preco-servico-cadastro"]').type('45,00');

    cy.get('[data-test="btn-cadastro-servico"]').click();
    cy.contains('Serviço cadastrado com sucesso!').should('be.visible');

    // Estoque
    cy.visit('http://127.0.0.1:8000/estoque/');

    cy.get('[data-test="nome-produto-cadastro"]').type(nomeProduto);
    cy.get('[data-test="quantidade-produto-cadastro"]').type('6');
    cy.get('[data-test="preco-produto-cadastro"]').clear().type('14,99');
    cy.get('[data-test="descricao-produto-cadastro"]').type('Específico para cabelos loiros');

    cy.get('[data-test="btn-cadastro-produto"]').click();
    cy.contains('Produto cadastrado com sucesso!').should('be.visible');


    // Caixa - realizar a venda
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar_cliente"]').type(nomeCliente);
    cy.contains(nomeCliente).should('be.visible').click();

    cy.get('[data-test="buscar_servico"]').type(nomeServico);
    cy.contains(nomeServico).should('be.visible').click();

    cy.get('[data-test="buscar-produto"]').type(nomeProduto);
    cy.contains(nomeProduto).should('be.visible').click();

    cy.get('[data-test="profissional"]').type('Joana');
    cy.get('[data-test="desconto"]').type('10');
    cy.get('[data-test="sinal"]').type('10');
    cy.get('[data-test="fatura"]').select('Sim');
    cy.get('[data-test="pagamento"]').select('Dinheiro');

    cy.get('[data-test="finalizar-venda"]').click();
    cy.contains('Venda registrada com sucesso!').should('be.visible');
  })
})

describe('E2E - Cliente', () => {
  it('Deve cadastrar cliente e validar que ele pode ser utilizado no caixa.', () => {
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
    cy.contains(nomeCliente).should('be.visible').click();
  })

  it('Deve cadastrar cliente, excluí-lo e validar que não aparece no caixa.', () => {
    const nomeCliente = `Cliente ${Date.now()}`;
    const cliente = gerarClientes();

    // Clientes
    cy.visit('http://127.0.0.1:8000/clientes/');

    cy.get('[data-test="nome-cadastro"]').clear().type(nomeCliente);
    cy.get('[data-test="telefone-cadastro"]').clear().type(cliente.telefone);
    cy.get('[data-test="nif-cadastro"]').clear().type(cliente.nif);
    cy.get('[data-test="nascimento-cadastro"]').clear().type(cliente.nascimento);
    cy.get('[data-test="email-cadastro"]').clear().type(cliente.email);
    
    cy.get('[data-test="btn-salvar"]').click();
    cy.contains('Cliente cadastrado com sucesso!').should('be.visible');

    // Excluindo cliente
    cy.get('[data-test="btn-atualizar-cliente"]').click();

    cy.get('[data-test="barra-pesquisa-clientes"]').type(nomeCliente);
    cy.contains(nomeCliente).should('be.visible').click();

    cy.get('[data-test="btn-excluir"]').click();

    cy.get('[data-test="btn-confirmar"]').click();
    cy.contains('Cliente excluído com sucesso!').should('be.visible');

    // Caixa
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar_cliente"]').type(nomeCliente);

    cy.contains(nomeCliente).should('not.exist');
    cy.contains("Cliente não encontrado. Adicionar cliente").should('be.visible');

  })
})

describe('E2E - Produto', () => {
  it('Deve criar produto com estoque zero e impedir a venda', () => {
    const nomeProduto = `Produto ${Date.now()}`;

    // Estoque
    cy.visit('http://127.0.0.1:8000/estoque/');

    cy.get('[data-test="nome-produto-cadastro"]').type(nomeProduto);
    cy.get('[data-test="quantidade-produto-cadastro"]').type('0');
    cy.get('[data-test="preco-produto-cadastro"]').clear().type('14,99');
    cy.get('[data-test="descricao-produto-cadastro"]').type('Específico para cabelos loiros');

    cy.get('[data-test="btn-cadastro-produto"]').click();
    cy.contains('Produto cadastrado com sucesso!').should('be.visible');


    // Caixa - realizar a venda
    cy.visit('http://127.0.0.1:8000/caixa/');

    cy.get('[data-test="buscar-produto"]').type(nomeProduto);
    cy.contains(nomeProduto).should('be.visible').click();

    cy.get('[data-test="profissional"]').type('Joana');
    cy.get('[data-test="fatura"]').select('Sim');
    cy.get('[data-test="pagamento"]').select('Dinheiro');

    cy.get('[data-test="finalizar-venda"]').click();
    cy.contains(`Produto "${nomeProduto}" sem estoque disponível para venda.`).should('be.visible');
  })

  it('Deve criar serviço, editar preço e validar o novo valor no caixa.', () => {
      const nomeProduto = `Produto ${Date.now()}`;
      cy.visit('http://127.0.0.1:8000/estoque/');

      cy.get('[data-test="nome-produto-cadastro"]').type(nomeProduto);
      cy.get('[data-test="quantidade-produto-cadastro"]').type('3');
      cy.get('[data-test="preco-produto-cadastro"]').clear().type('10,00');

      cy.get('[data-test="btn-cadastro-produto"]').click();
      cy.contains('Produto cadastrado com sucesso!').should('be.visible');

      cy.get('[data-test="btn-editar-produto"]').click();

      cy.get('[data-test="barra-pesquisa-produtos"]').type(nomeProduto);
      cy.contains(nomeProduto).should('be.visible').click();

      cy.get('[data-test="preco-produto-edicao"]').clear().type('29,00');

      cy.get('[data-test="btn-salvar-edicao"]').click();
      cy.contains('Produto atualizado com sucesso!').should('be.visible');

      // Caixa 
      cy.visit('http://127.0.0.1:8000/caixa/');

      cy.get('[data-test="buscar-produto"]').type(nomeProduto);
      cy.contains(nomeProduto).should('be.visible').click();

      cy.get('.produto_valor').invoke('val').should('include', '29');
  })
})