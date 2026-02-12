let itensVenda = [];

function adicionarItem() {
    let select = document.getElementById('item_selecionado');
    let id = select.value;
    let nome = select.options[select.selectedIndex].text;
    let valor = parseFloat(select.options[select.selectedIndex].dataset.valor);
    let tipo = select.options[select.selectedIndex].dataset.tipo;
    let qtd = parseInt(document.getElementById('quantidade').value);

    let subtotal = valor * qtd;

    itensVenda.push({id, nome, valor, qtd, subtotal, tipo});
    atualizarTabela();
}

function atualizarTabela() {
    let tbody = document.querySelector('#tabela_itens tbody');
    tbody.innerHTML = '';
    let total = 0;

    itensVenda.forEach((item, index) => {
        total += item.subtotal;
        tbody.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td>${item.valor.toFixed(2)}</td>
                <td>${item.subtotal.toFixed(2)}</td>
                <td><button onclick="removerItem(${index})">Remover</button></td>
            </tr>
        `;
    });

    let desconto = parseFloat(document.getElementById('desconto').value) || 0;
    document.getElementById('total').innerText = (total - desconto).toFixed(2);
}

function removerItem(index) {
    itensVenda.splice(index, 1);
    atualizarTabela();
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

let clienteSelecionado = null;


function finalizarVenda() {
    const botao = document.getElementById('btnFinalizar');
    botao.disabled = true; // desativa o botão

    // pega o total da tela
    const totalElem = document.getElementById('total');
    let total = parseFloat(totalElem.textContent.replace('€', '').replace(',', '.').trim());

        if (total <= 0) {
            alert('O total da venda não pode ser zero ou negativo!');
            botao.disabled = false; // ativa o botão
            return;
        }

    // forma de pagamento, vindo do select do HTML
    const formaPagamento = document.getElementById('forma_pagamento').value;
        if (!formaPagamento) {
            alert('Por favor, selecione uma forma de pagamento!')
            botao.disabled = false; // ativa o botão
            return;
        } 

    for (const p of document.querySelectorAll('.produto-selecionado[data-id]')) {
        const estoqueDisponivel = parseInt(p.dataset.estoque, 10) || 0; // Use o estoque real disponível
        const nome = p.dataset.nome || 'Produto sem nome';

            if (estoqueDisponivel <= 0) {
                alert(`O produto "${nome}" está sem estoque disponível e não pode ser vendido.`);
                botao.disabled = false;
                return;
            }
    }
        

    // pega o cliente, se não tiver manda null
    const clienteId = document.getElementById('cliente_id').value;
    const desconto = parseFloat(document.getElementById('desconto').value) || 0;
    const sinal = parseFloat(document.getElementById('sinal').value) || 0;
    const fatura = document.querySelector('#fatura').value; // Corrigido para pegar o valor
    const profissional = document.getElementById('profissional').value;
    const observacoes =document.querySelector('textarea[name="observacoes"]').value;
    const produtoSelecionado = Array.from(document.querySelectorAll('.produto-selecionado')).map(p => ({
            // A quantidade aqui é 1, conforme definido em inicializarBuscaProduto
            id: p.dataset.id,
            quantidade: parseInt(p.dataset.quantidade) || 1, 

    }))
    .filter(p => p.id); // filtra ids vazios
    const servicosSelecionados = Array.from(document.querySelectorAll('.servico-selecionado')).map(s => ({
        id: s.dataset.id,
        quantidade: parseInt(s.dataset.quantidade) || 1
    }))
    .filter(s => s.id);
    

    fetch('/caixa/finalizar/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            cliente: clienteId,
            total: total,
            forma_pagamento: formaPagamento,
            desconto: desconto,
            sinal: sinal,
            fatura: fatura,
            produto: produtoSelecionado,
            servico: servicosSelecionados,
            profissional: profissional,
            observacoes: observacoes,
        })
        
    })
    
    .then(response => response.json())
    .then(data => {
        
        if (data.success) {
            const msg = document.getElementById('mensagem-sucesso');
            msg.style.display = 'block';

            // some após 3s
            setTimeout(() => {
                msg.style.display = 'none';
                setTimeout(() => location.reload(), 500); // recarrega a página
            }, 2000);

        } else {
            alert("Erro ao finalizar a venda. " + data.error);
        }
    });
}

function removerAcentos(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}


function inicializarBuscaCliente(bloco) {
    const input = bloco.querySelector('.buscar_cliente'); // campo de texto para digitar o nome do cliente
    const lista = bloco.querySelector('.lista_clientes'); // lista onde os resultados da busca são exibidos
    const dados = bloco.querySelector('.dados_cliente'); // bloco onde exibe os detalhes do cliente selecionado
    const tel = bloco.querySelector('.cliente_telefone'); // campo telefone do cliente
    const nif = bloco.querySelector('.cliente_nif'); // campo nif do cliente
    const email = bloco.querySelector('.cliente_email'); // campo e-mail do cliente
    const nasc = bloco.querySelector('.cliente_nascimento'); // campo nascimento do cliente
    
    // evento para quando o usuário digitar no campo de busca
    input.addEventListener('input', function() {
        const termoDigitado = this.value.trim().toLowerCase();
        const termoNormalizado = removerAcentos(termoDigitado); // remove os espaços extras e acentos digitados

        if (termoDigitado.length > 0) {
            // faz uma requisição para buscar clientes que corresponde a pesquisa
            fetch(`/caixa/buscar-clientes/?q=${encodeURIComponent(termoDigitado)}`)
                .then(response => response.json())
                .then(data => {
                    lista.innerHTML = ''; // limpa a lista antes de mostrar novos

                    const resultados = data.filter(c => {
                        const nomeNormalizado = removerAcentos((c.nome || '').toLowerCase());
                        const telefone = (c.telefone || '');
                        const nifCliente = (c.nif || '');
                        
                        return (
                            nomeNormalizado.includes(termoNormalizado) || 
                            telefone.includes(termoDigitado) || 
                            nifCliente.includes(termoDigitado)
                        );
                    });    


                    if (data.length === 0) {
                        // Nenhum cliente encontrado > mostra o link para cadastro
                        lista.innerHTML = `
                            <li class="text-danger">
                                Cliente não encontrado.
                                <a href="/clientes/" class="text-primary">Adicionar cliente</a>
                            </li>`;
                        return;
                    }

                    // para cada cliente encontrado, cria um item na lista
                    data.forEach(c => {
                        
                            const li = document.createElement('li');
                            li.classList.add('list-group-item', 'list-group-item-action');
                            li.textContent = `${c.nome} • ${c.telefone} • NIF: ${c.nif}`; // onde exibe os dados do cliente
                            li.style.cursor = 'pointer';

                            // evento de clique em um cliente selecionado
                            li.addEventListener('click', () => {
                                input.value = c.nome; // preenche o input com o nome do cliente selecionado
                                clienteSelecionado = c.id; // armazena o id do cliente selecionado
                                document.getElementById('cliente_id').value = c.id; // atualiza o campo hidden com o id
                                lista.innerHTML = ''; // limpa a lista

                                // Busca os dados completos do cliente
                                fetch(`/caixa/detalhes_cliente/${c.id}/`)
                                    .then(res => res.json())
                                    .then(cliente => {
                                        tel.value = cliente.telefone || ''; // preenche o telefone
                                        nif.value = cliente.nif || ''; // preenche o nif
                                        email.value = cliente.email || ''; //preenche o email
                                        nasc.value = cliente.nascimento || ''; // preenche o nascimento
                                        dados.style.display = 'block'; // mostra o bloco
                                    });
                                //define hidden e carrega histórico    
                                const modalHidden = document.getElementById('id_cliente_caixa'); //!!!!!!!!!!!!!!!!
                                if (modalHidden) modalHidden.value = c.id; //!!!!!!!!!!!!!!!!!
                                carregarHistoricoFicha(c.id); // carrega historico imediatamente
                            });
                            lista.appendChild(li); // adiciona o item na lista
                        
                    });
                });
        } else {
            lista.innerHTML = '';
            dados.style.display = 'none';
        }
    });
}
// Inicializa todos os blocos de cliente
document.querySelectorAll('.cliente-bloco').forEach(inicializarBuscaCliente);


function inicializarBuscaServico(bloco) {
    const input = bloco.querySelector(".buscar_servico");
    const lista = bloco.querySelector(".lista_servicos");
    const dados = bloco.querySelector(".dados_servico");
    const valor = bloco.querySelector(".servico_valor");

    input.addEventListener('input', function() {
        const termo = this.value.trim();

        if (termo.length < 1) {
            lista.innerHTML = '';
            return;
        }

        fetch(`/caixa/buscar-servicos/?q=${encodeURIComponent(termo)}`)
            .then(r => r.json())
            .then(servicos => {
                lista.innerHTML = '';

                servicos.forEach(s => {
                    const li = document.createElement('li');
                    const novoPreco = Number(s.preco).toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    li.textContent = `${s.nome} • ${novoPreco}€`;
                    li.style.cursor = 'pointer';

                    li.addEventListener('click', () => {
                        input.value = s.nome;
                        valor.value = novoPreco; // coloca o valor no campo
                        calcularTotal(); // força o cálculo do valor total no caixa
                        dados.style.display = 'block';
                        lista.innerHTML = '';

                        bloco.classList.add('servico-selecionado');
                        bloco.dataset.id = s.id;
                        bloco.dataset.quantidade = 1;
                    });
                    lista.appendChild(li);
                });
            });
    });
}

//inicializa o primeiro bloco já existente
document.querySelectorAll('.bloco-servico').forEach(inicializarBuscaServico);

// botão de limpar o primeiro bloco de serviço
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('btn-clear-servico')){
        let bloco = e.target.closest('.bloco-servico');
        bloco.querySelector('.buscar_servico').value = '';
        bloco.querySelector('.servico_valor').value = '';
        calcularTotal(); // atualiza o valor total depois de limpar no caixa
    }
});

//botão para adicionar novos blocos
document.getElementById('btn_add_servico').addEventListener('click', () => {
    const container = document.getElementById('container_servicos');
    const novoBloco = container.firstElementChild.cloneNode(true);

    //limpa os campos do bloco clonado
    novoBloco.querySelector('.buscar_servico').value = '';
    novoBloco.querySelector('.lista_servicos').innerHTML = '';
    novoBloco.querySelector('.servico_valor').value = '';

    // Troca o botão clear pelo remove
    let btnContainer = novoBloco.querySelector('.btn-clear-servico');
    if(btnContainer){
        btnContainer.remove(); // remove o botão clear
    }

    // mostra o botao x nos clones
    const btnRemove = novoBloco.querySelector('.btn-remove-servico');
    btnRemove.style.display = 'inline-block';
    btnRemove.addEventListener('click', () => {
        novoBloco.remove();
        calcularTotal(); // atualiza valor no caixa depois de remover
    });

    container.appendChild(novoBloco);
    inicializarBuscaServico(novoBloco);
});

function inicializarBuscaProduto(bloco) {
    const input = bloco.querySelector('.buscar_produto');
    const lista = bloco.querySelector('.lista_produtos');
    const dados = bloco.querySelector('.dados_produto');
    const valor = bloco.querySelector('.produto_valor');
   
    input.addEventListener('input', function() {
        const termo = this.value.trim();

        if (termo.length < 1) {
            lista.innerHTML = '';
            return;
        }
        

        fetch(`/caixa/buscar-produtos/?q=${encodeURIComponent(termo)}`)
            .then(response => response.json())
            .then(data => {
                //lista.innerHTML = '';
                lista.replaceChildren();

                if (!data || data.length === 0) {
                    return;
                }

                data.forEach(p => {
                    const li = document.createElement('li');
                    const precoFmt = Number(p.preco).toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    li.textContent = `${p.nome} • ${precoFmt}€`;
                    li.dataset.id = p.id; // <- ESSENCIAL
                    li.dataset.quantidade = p.quantidade; // <- ESSENCIAL
                    li.dataset.preco = p.preco; // <- ESSENCIAL
                    li.dataset.nome = p.nome;
                    li.dataset.estoque = p.quantidade;
                    li.style.cursor = 'pointer';

                    li.addEventListener('click', () => {
                        input.value = p.nome;
                        valor.value = precoFmt; // coloca o valor no campo
                        calcularTotal(); // força a atualizar o valor total no caixa
                        const blocoAtual = input.closest('.bloco-produto');
                        const estoqueInput = blocoAtual.querySelector('.estoque_produto');
                        if(estoqueInput) {
                            estoqueInput.value = p.quantidade;
                        }
                        dados.style.display = 'block';

                        // esconde a lista ao selecionar
                        lista.replaceChildren();


                        // cria o produto selecionado apenas para enviar no finalizarVenda()
                        // const container = document.getElementById('container_produtos');
                        // const bloco = document.createElement('div');
                        bloco.classList.add('produto-selecionado');
                        bloco.dataset.id = p.id;
                        bloco.dataset.quantidade = 1; // sempre 1, já que vende 1 por vez
                        bloco.dataset.preco = p.preco;
                        bloco.dataset.nome = p.nome;
                        bloco.dataset.estoque = p.quantidade;

                        // container.appendChild(bloco);

                    });

                    lista.appendChild(li);
                });
            });
    });
}

// inicializa o primeiro bloco
document.querySelectorAll('.bloco-produto').forEach(inicializarBuscaProduto);

// botão de limpar o primeiro bloco de produtos
document.addEventListener('click', function(e){
    if(e.target.classList.contains('btn-clear-produto')){
        let bloco = e.target.closest('.bloco-produto');
        bloco.querySelector('.buscar_produto').value = '';
        bloco.querySelector('.produto_valor').value = '';
        bloco.querySelector('.estoque_produto').value = '';
        //remove marcação do dataset
        bloco.classList.remove('produto-selecionado');
        bloco.removeAttribute('data-id');
        bloco.removeAttribute('data-quantidade');
        bloco.removeAttribute('data-preco');

        calcularTotal(); // atualiza o total depois de limpar
    }
})

// botão para adicionar novos blocos
document.getElementById('btn_add_produto').addEventListener('click', () => {
    const container = document.getElementById('container_produtos');
    const novoBloco = container.firstElementChild.cloneNode(true);

    // limpa campos
    novoBloco.querySelector('.buscar_produto').value = '';
    novoBloco.querySelector('.lista_produtos').innerHTML = '';
    // novoBloco.querySelector('.dados_produto').style.display = 'none';
    novoBloco.querySelector('.produto_valor').value = '';
    novoBloco.querySelector('.estoque_produto').value = '';

    // troca o botão clear pelo remove
    let btnContainer = novoBloco.querySelector('.btn-clear-produto');
    if (btnContainer){
        btnContainer.remove(); // remove o botão clear 
    }
    
    // mostra o botão x nos clones
    const btnRemove = novoBloco.querySelector('.btn-remove-produto');
    btnRemove.style.display = 'inline-block';
    btnRemove.addEventListener('click', () => {
        novoBloco.remove();
        calcularTotal(); // atualiza valor no caixa depois de remover
    });

    container.appendChild(novoBloco);
    inicializarBuscaProduto(novoBloco);
});


function getNumericValue(input) {
    if (!input) return 0;
    let val = String(input.value || 0); // garante que sempre será uma string

    // remove símbolo €, troca a vírgula por ponto, tira espaços
    val = val.replace('€', '').replace(',', '.').trim();
    return parseFloat(val) || 0;
}

function calcularTotal() {
    let total = 0;
    // somar serviço
    document.querySelectorAll('.servico_valor').forEach(input => {
        total += getNumericValue(input);
    });

    // somar produto
    document.querySelectorAll('.produto_valor').forEach(input => {
        total += getNumericValue(input);
    });

    // Desconto e sinal
    total -= getNumericValue(document.getElementById('desconto'));
    total -= getNumericValue(document.getElementById('sinal'));

    // Garante que não aparece NaN
    if (isNaN(total)) total = 0;

    // Mostrar no campo
    const totalFinal = document.getElementById('total');
    if (totalFinal) {
        totalFinal.textContent = new Intl.NumberFormat('pt-PT', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(total) + '€';

        if (total <= 0) {
        totalFinal.style.color = 'red'; // vermelho se zero ou negativo
        } else {
        totalFinal.style.color = 'white'; // cor normal se positivo
        }
    }

}
//Atualiza sempre que algum campo mudar
document.addEventListener('input', calcularTotal);
document.addEventListener('change', calcularTotal);



// filtro no relatório
document.querySelectorAll('#filtro-tipo, #filtro-produto', '#filtro-cliente').forEach(el => {
    el.addEventListener('input', filtrarHistorico);
});

function filtrarHistorico() {
    const tipo = document.getElementById('filtro-tipo').value.toLowerCase();
    const produto = document.getElementById('filtro-produto').value.toLowerCase();
    const cliente = document.getElementById('filtro-cliente').value.toLowerCase();

    document.querySelectorAll('#tabela-historico tbody tr').forEach(tr => {
        const tdProduto = tr.children[0].innerText.toLowerCase();
        const tdTipo = tr.children[1].innerText.toLowerCase();
        const tdCliente = tr.children[3].innerText.toLowerCase();

        if ((tipo === '' || tdTipo.includes(tipo)) &&
            (produto === '' || tdProduto.includes(produto)) &&
            (cliente === '' || tdCliente.includes(cliente))) {
                tr.style.display = '';
        } else {
                tr.style.display = 'none';
        }
    });
}

// para carregar histórico de fichas
function carregarHistoricoFicha(clienteId) {
    const container = document.getElementById('historico-fichas');
    if (!clienteId) {
        container.innerHTML = '<p class="text-muted">Nenhum cliente selecionado.</p>';
        return;
    }
    // solicita partial html da view detalhe_cliente
    fetch(`/clientes/${clienteId}/detalhe/`, { 
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(r => {
        if (!r.ok) throw new Error ('Erro ao carregar fichas.');
        return r.text();
    })
    .then(html => {
        container.innerHTML = html;
    })
    .catch(err => {
        console.error('Erro carregarHistoricoFichas:', err);
        container.innerHTML = '<p class="text-danger">Erro ao carregar histórico.</p>';
    });
}

// fecha modal tentando BS5, depois BS4/jQuery, depois fallback
function fecharModalById(modalId) {
    const el = document.getElementById(modalId);
    if (!el) return;

    // tenta bootstrap 4 (jQuery)
    try {
        if (window.jQuery && typeof $(el).modal === 'function') {
            $(el).modal('hide');
            return;
        }
    } catch (e) {
        console.warn('closeModal: BS4/jQuery hide falhou', e);
    }

    // fallback: remove classes / backdrop
    el.classList.remove('show');
    el.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.parentNode.removeChild(backdrop);
}


//adicionar e carregar fichas no caixa
document.addEventListener('DOMContentLoaded', function() {
    const btnSalvar = document.getElementById('btnSalvarFichaCaixa');

    btnSalvar.addEventListener('click', function() {
        const form = document.getElementById('form-ficha-caixa');
        const clienteId = document.getElementById('cliente_id').value; 

        if (!clienteId) {
            alert('Selecione um cliente antes de adicionar a ficha!');
            return;
        }

        const formData = new FormData(form);

        fetch(`/clientes/${clienteId}/ficha/adicionar/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(r => r.json())
        .then(data => {
            if (data.status === 'ok') {
                //adiciona ficha no histórico
                document.getElementById('historico-fichas').insertAdjacentHTML('afterbegin', data.html_ficha); // afterbegin deixa a ficha "em cima"

                // fechar modal
                $('#modalFicha').modal('hide');
               

                // cria aviso visual temporário
                const flash = document.createElement('div');
                flash.className = 'alert alert-success mt-3';
                flash.textContent = 'Ficha adicionada com sucesso!';
                const hist = document.getElementById('historico-fichas');
                hist.parentNode.insertBefore(flash, hist);
                
                form.reset(); // limpa os campos
                //modal.hide(); // fecha o modal
                fecharModalById('modalFicha');

                setTimeout(() => flash.remove(), 3000);
            } else {
                alert('Erro ao salvar ficha.');
            }
        })
        .catch(err => console.error(err));
    });

    // carregar fichas ao expandir o collapse
    const collapse = document.getElementById('collapseFichas');
    collapse.addEventListener('show.bs.collapse', function() {
        const clienteId = document.getElementById('cliente_id').value;
        if (!clienteId) return;

        fetch(`/clientes/${clienteId}/detalhe/`, { headers: {'X-Requested-With': 'XMLHttpRequest'}})
            .then(r => r.text())
            .then(html => {
                document.getElementById('historico-fichas').innerHTML = html;
            });
    });
});

// garante que o formulário é limpo sempre que o modal fecha salvar/cancelar/esc
document.addEventListener('DOMContentLoaded', function() {
    const modalEl = document.getElementById('modalFicha');
    const form = document.getElementById('form-ficha-caixa');

    if (modalEl) {
        // e para jquery/BS4 (fallback)
        if (window.jQuery) {
            $('#modalFicha').on('hidden.bs.modal', function () {
                document.getElementById('form-ficha-caixa').reset();
            });
        }
    }
});