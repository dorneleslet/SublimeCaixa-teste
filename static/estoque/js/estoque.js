document.addEventListener("DOMContentLoaded", function() {
    exibirFormEstoque("1");
    document.getElementById('mensagem-sucesso-produto').style.display = 'none';
});

function exibirFormEstoque(tipo) {
    novo = document.getElementById('form-novo-produto');
    editar = document.getElementById('form-editar-produto');

    if(tipo == "1"){
        editar.style.display = "none";
        novo.style.display = "block";
    } else if(tipo == "2"){
        novo.style.display = "none";
        editar.style.display = "block";
    }
}

function cadastrarProduto(event) {
    event.preventDefault();

    const form = document.getElementById('form-novo-produto');
    const precoInput = form.querySelector('[name="preco_unitario"]');
    const erroDiv = document.getElementById('erro-preco');

    precoInput.classList.remove('is-invalid');
    if (erroDiv) erroDiv.style.display = 'none';

    // Remove pontos de milhar e substitui vírgula por ponto
    let precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');

    // Verifica se o valor é válido e maior que zero
    if (isNaN(precoFormatado) || Number(precoFormatado) <= 0) {
        precoInput.classList.add('is-invalid');
        if (erroDiv) erroDiv.style.display = 'block';
        return; // não envia o formulário
    }

    let formData = new FormData(form);


    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(resp => resp.json())
    .then(data => {
        //limpar erros antigos
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        if (data.status === 'erro') {
            for (const campo in data.erros) {
                let input = document.getElementById(campo);
                if (input) {
                    input.classList.add('is-invalid');

                    let div = document.createElement('div');
                    div.classList.add('invalid-feedback');
                    div.classList.add('error-message'); // Adiciona a classe para consistência
                    div.style.color = 'red';
                    div.innerText = data.erros[campo];

                    input.insertAdjacentElement('afterend', div);
                }
            }
            return;
        }
        if (data.status === 'sucesso') {
            alert('Produto cadastrado com sucesso!');
            form.reset();
        }
    })
    .catch(err => console.error('Erro:', err));
}

document.addEventListener("DOMContentLoaded", function() {
    listarProdutos();
});

//Filtrar produtos na lista
function filtrarProdutos() {
    const input = removerAcentos(document.getElementById('search-bar-produto').value.toLowerCase());
    const lista = document.getElementById('lista-produtos');
    const items = lista.getElementsByTagName('button'); // pesquisa na barra??

    for (let i = 0; i < items.length; i++) {
        const texto = removerAcentos(items[i].innerText.toLowerCase());
        items[i].style.display = texto.includes(input) ? '' : 'none';
    }
}

// Carregar dados do produto para edição
function carregarProduto(id, el) {
        //el é o botão clicado (this)
        const btn = el || document.getElementById(`produto-${id}`);
        if (!btn) {
            console.error('Botão do produto não encontrado para id=', id);
            return;
        }

        const nome = btn.dataset.nome || '';
        const quantidade = btn.dataset.quantidade || '';
        const preco_unitario = btn.dataset.preco_unitario || '';
        const descricao = btn.dataset.descricao || '';

        //Preenche os campos do formulário
        document.getElementById('produto_id').value = id;
        document.getElementById('editar_nome').value = nome;
        document.getElementById('editar_quantidade').value = quantidade;
        const campoPreco = document.getElementById('editar_preco_unitario');
        campoPreco.value = isNaN(Number(preco_unitario.replace(',', '.'))) ? 0: Number(preco_unitario.replace(',', '.')); // Se não conseguir converter, põe 0
        document.getElementById('editar_descricao').value = descricao || '';
        document.getElementById('nova_entrada').value = '';

        // Bloqueia todos os campos para edição ao abrir
        document.getElementById('editar_nome').disabled = true;
        document.getElementById('editar_quantidade').disabled = true;
        document.getElementById('nova_entrada').disabled = true;
        document.getElementById('editar_preco_unitario').disabled = true;
        document.getElementById('editar_descricao').disabled = true;

        // Reseta os botões de ação: exibe "Editar dados" e esconde "Salvar alterações"
        const btnEditar = document.getElementById('btn-editar-produto-dados');
        if (btnEditar) btnEditar.style.display = 'inline-block';
        const btnSalvar = document.getElementById('btn-edit-salvar-produto');
        if (btnSalvar) btnSalvar.style.display = 'none';
        const btnExcluir = document.getElementById('btn-excluir-produto');
        if (btnExcluir) btnExcluir.style.display = 'none';

        // Limpa possíveis validações de erro anteriores
        const erroDiv = document.getElementById('erro-editar-preco');
        if (erroDiv) erroDiv.style.display = 'none';
        campoPreco.classList.remove('is-invalid');

        // Define a action do form dinamicamente
        const form = document.getElementById('form-produto-edicao') || document.querySelector('#form-produto-edicao form');
        if (form){
            form.action = `/estoque/editar/${id}/`;
        } else {
            console.warn('Form de edição não encontrado (form === null).')
        }

        // Mostra o formulário de edição e esconde a lista
        document.getElementById('form-produto-edicao').style.display = 'block';
        document.getElementById('lista-produtos').style.display = 'none';
        document.getElementById('search-bar-produto').style.display = 'none';

}

function habilitarEdicaoProduto() {
    // Habilita os campos do formulário para edição
    document.getElementById('editar_nome').disabled = false;
    document.getElementById('nova_entrada').disabled = false;
    document.getElementById('editar_preco_unitario').disabled = false;
    document.getElementById('editar_descricao').disabled = false;

    // Alterna os botões
    const btnEditar = document.getElementById('btn-editar-produto-dados');
    if (btnEditar) btnEditar.style.display = 'none';
    const btnSalvar = document.getElementById('btn-edit-salvar-produto');
    if (btnSalvar) btnSalvar.style.display = 'inline-block';
    const btnExcluir = document.getElementById('btn-excluir-produto');
    if (btnExcluir) btnExcluir.style.display = 'inline-block';
}

function editarProduto(produtoId) {
    // Esconde a lista
    document.getElementById('lista-produtos').style.display = 'none';
    document.getElementById('search-bar-produto').style.display = 'none';

    // Mostra o formulário de edição
    document.getElementById('form-produto-edicao').style.display = 'block';

    // Busca dados via AJAX (se quiser preencher automaticamente)
    fetch(`/estoque/editar/${produtoId}/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editar_nome').value = data.nome;
            document.getElementById('editar_quantidade').value = data.quantidade;
            document.getElementById('editar_preco_unitario').value = data.preco_unitario;
            document.getElementById('editar_descricao').value = data.descricao;
            document.getElementById('produto_id').value = produtoId;
            document.getElementById('nova_entrada').value = '';

            // Bloqueia todos os campos para edição ao abrir
            document.getElementById('editar_nome').disabled = true;
            document.getElementById('editar_quantidade').disabled = true;
            document.getElementById('nova_entrada').disabled = true;
            document.getElementById('editar_preco_unitario').disabled = true;
            document.getElementById('editar_descricao').disabled = true;

            const btnEditar = document.getElementById('btn-editar-produto-dados');
            if (btnEditar) btnEditar.style.display = 'inline-block';
            const btnSalvar = document.getElementById('btn-edit-salvar-produto');
            if (btnSalvar) btnSalvar.style.display = 'none';
            const btnExcluir = document.getElementById('btn-excluir-produto');
            if (btnExcluir) btnExcluir.style.display = 'none';
        })
        .catch(error => console.error('Erro ao buscar produto:', error));
}

// Voltar para lista de produtos
function voltarListaProduto() {
    document.getElementById('form-produto-edicao').style.display = 'none';
    document.getElementById('lista-produtos').style.display = 'block';
    document.getElementById('search-bar-produto').style.display = 'block';
    document.getElementById('mensagem-sucesso-produto').style.display = 'none';

    // Reseta o estado dos campos para disabled
    document.getElementById('editar_nome').disabled = true;
    document.getElementById('editar_quantidade').disabled = true;
    document.getElementById('nova_entrada').disabled = true;
    document.getElementById('editar_preco_unitario').disabled = true;
    document.getElementById('editar_descricao').disabled = true;

    // Reseta botões
    const btnEditar = document.getElementById('btn-editar-produto-dados');
    if (btnEditar) btnEditar.style.display = 'inline-block';
    const btnSalvar = document.getElementById('btn-edit-salvar-produto');
    if (btnSalvar) btnSalvar.style.display = 'none';
    const btnExcluir = document.getElementById('btn-excluir-produto');
    if (btnExcluir) btnExcluir.style.display = 'none';
}

// Limpar formulário de edição
function limparFormularioEdicao() {
    document.getElementById('produto_id').value = '';
    document.getElementById('editar_nome').value = '';
    document.getElementById('editar_quantidade').value = '';
    document.getElementById('nova_entrada').value = '';
    document.getElementById('editar_preco_unitario').value = '';
    document.getElementById('editar_descricao').value = '';
    document.getElementById('form-produto-edicao').style.display = 'none';
    document.getElementById('lista-produtos').style.display = 'block';
    document.getElementById('search-bar-produto').style.display = 'block';
    document.getElementById('mensagem-sucesso-produto').style.display = 'none';

    // Reseta o estado dos campos para disabled
    document.getElementById('editar_nome').disabled = true;
    document.getElementById('editar_quantidade').disabled = true;
    document.getElementById('nova_entrada').disabled = true;
    document.getElementById('editar_preco_unitario').disabled = true;
    document.getElementById('editar_descricao').disabled = true;

    // Reseta botões
    const btnEditar = document.getElementById('btn-editar-produto-dados');
    if (btnEditar) btnEditar.style.display = 'inline-block';
    const btnSalvar = document.getElementById('btn-edit-salvar-produto');
    if (btnSalvar) btnSalvar.style.display = 'none';
    const btnExcluir = document.getElementById('btn-excluir-produto');
    if (btnExcluir) btnExcluir.style.display = 'none';
}



// Confirmar exclusão
function confirmarExcluirProduto() {
    document.getElementById('confirm-delete-produto').style.display = 'flex';


    //Cancelar exclusão
    document.getElementById('btn-cancel-delete-produto').onclick = () => {
        document.getElementById('confirm-delete-produto').style.display = 'none'
    };

    //Executar exclusão
    document.getElementById('btn-confirm-delete-produto').onclick = () => {
        const id = document.getElementById('produto_id').value;
        fetch(`/estoque/excluir/${id}/`, {
            method: 'POST',
            headers: {'X-CSRFToken': '{{ csrf_token }}'}
        })
        .then(resp => {
            if (resp.ok) {
                document.getElementById('confirm-delete-produto').style.display = 'none';
                window.location.reload();
            } else {
                alert('Erro ao excluir produto.');
            }
        })
        .catch(err => {
            console.error(err);
        });
    };
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Verifica se cookie começa com name=
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

//Atualizar produto via fetch POST
function atualizarProduto() {
    // pega o id direto do input hidden (preenchido ao abrir edição)
    let produtoId = document.getElementById('produto_id').value;
    // pega os valores do formulário
    let nome = document.getElementById('editar_nome').value;
    //let quantidade = document.getElementById('editar_quantidade').value;
    let preco_unitario = document.getElementById('editar_preco_unitario').value;
    let descricao = document.getElementById('editar_descricao').value;
    let novaEntrada = parseInt(document.getElementById('nova_entrada').value) || 0;
    
    const precoInput = document.getElementById('editar_preco_unitario');
    const erroDiv = document.getElementById('erro-editar-preco');

    precoInput.classList.remove('is-invalid');
    if (erroDiv) erroDiv.style.display = 'none';


    // validação rápida
    if (!produtoId) {
        alert('ID do produto não encontrado. Reabra a edição e tente novamente.');
        return;
    }
    if (!nome || preco_unitario === '') {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    // converter virgula para ponto
    preco_unitario = String(preco_unitario).replace(/\./g, '').replace(',', '.');
    if (isNaN(preco_unitario) || Number(preco_unitario) <= 0) {
        precoInput.classList.add('is-invalid');
        if (erroDiv) erroDiv.style.display = 'block';
        return;
    }

    const btnSalvar = document.getElementById('btn-edit-salvar-produto');
    const originalText = btnSalvar.value;
    btnSalvar.disabled = true;
    btnSalvar.value = "Salvando...";

    // envia para o backend
    fetch(`/estoque/editar/${produtoId}/`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: new URLSearchParams({
            nome: nome,
            //quantidade: quantidade,
            preco_unitario: preco_unitario,
            descricao: descricao,
            nova_entrada: novaEntrada,
        })
    })
        .then(resp => {
            if (resp.ok) {
                document.getElementById('mensagem-sucesso-produto').style.display = 'block';
                btnSalvar.value = "Salvo!";

                // limpa o campo nova_entrada
                document.getElementById('nova_entrada').value = '';

                // Bloqueia todos os campos novamente
                document.getElementById('editar_nome').disabled = true;
                document.getElementById('editar_quantidade').disabled = true;
                document.getElementById('nova_entrada').disabled = true;
                document.getElementById('editar_preco_unitario').disabled = true;
                document.getElementById('editar_descricao').disabled = true;

                const btnEditar = document.getElementById('btn-editar-produto-dados');
                if (btnEditar) btnEditar.style.display = 'inline-block';
                if (btnSalvar) btnSalvar.style.display = 'none';
                const btnExcluir = document.getElementById('btn-excluir-produto');
                if (btnExcluir) btnExcluir.style.display = 'none';

                setTimeout(() => {
                   document.getElementById('mensagem-sucesso-produto').style.display = 'none'; 
                   btnSalvar.disabled = false;
                   btnSalvar.value = originalText;
                   listarProdutos(); // atualiza a lista sem reload
                   // esconde o formulário e mostra a lista
                   document.getElementById('form-produto-edicao').style.display = 'none';
                   document.getElementById('lista-produtos').style.display = 'block';
                   document.getElementById('search-bar-produto').style.display = 'block';
                }, 2000);
            } else {
                btnSalvar.disabled = false;
                btnSalvar.value = originalText;
                resp.json().then(j => {
                    console.error('Erro ao atualizar:', j);
                    alert('Erro ao atualizar produto. Veja console.', j);
                }).catch(() => alert('Erro ao atualizar produto.'));
            }
        })
        .catch(err => {
            console.error('fetch error:', err);
            btnSalvar.disabled = false;
            btnSalvar.value = originalText;
            alert('Erro ao atualizar produto (network).');
        });
}

function listarProdutos() {
  fetch('/estoque/produtos/lista/')
    .then(response => response.json())
    .then(produtos => {
      const lista = document.getElementById('lista-produtos');
      lista.innerHTML = ''; // limpa a lista atual
      document.getElementById('search-bar-produto').style.display = 'block';
    //    // ordem alfabética ignorando os acentos AQUI TA FUNCIONANDO  
    //   produtos.sort((a, b) => {
    //     const nomeA = removerAcentos(a.nome);
    //     const nomeB = removerAcentos(b.nome);
    //     return nomeA.localeCompare(nomeB);
    //   });

      // DocumentFragment melhora a performance de renderização no navegador
      const fragment = document.createDocumentFragment();

      produtos.forEach(produto => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'list-group-item list-group-item-action text-start';
        btn.id = `produto-${produto.id}`;
        btn.dataset.nome = produto.nome;
        btn.dataset.quantidade = produto.quantidade;
        btn.dataset.preco_unitario = produto.preco_unitario;
        btn.dataset.descricao = produto.descricao;
        btn.onclick = () => carregarProduto(produto.id, btn);

        const precoFormatado = produto.preco_unitario.toString().replace('.', ',');

        btn.textContent = `${produto.nome} • ${produto.quantidade} unidades • ${precoFormatado}€`;
        //lista.appendChild(btn); AQUI TA FUNCIONANDO
        fragment.appendChild(btn);
      });
      lista.appendChild(fragment);
    })
    .catch(err => console.error('Erro ao listar produtos:', err));

// filtro usando a função removerAcentos AQUI TA FUNCIONANDO
// document.getElementById('search-bar-produto').addEventListener('input', function() {
//     const query = removerAcentos(this.value);

//     const botoes = document.querySelectorAll('#lista-produtos button');
//     botoes.forEach(btn => {
//         const nomeProduto = removerAcentos(btn.dataset.nome);
//         if (nomeProduto.includes(query)) {
//             btn.style.display = '';
//         } else {
//             btn.style.display = 'none';
//         }
//     });
// });

}

function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function registarSaida(produtoId, quantidadeVendida){
    fetch(`/estoque/saida/${produtoId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: new URLSearchParams({
            quantidade: quantidadeVendida
        })
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.status === 'success'){
            alert(`Saída registrada! Estoque atual: ${data.quantidade}`);
            listarProdutos(); // atualiza a lista
        } else {
            alert('Erro: ' + data.message);
        }
    })
    .catch(err => console.error('Erro na saída: ', err));
}