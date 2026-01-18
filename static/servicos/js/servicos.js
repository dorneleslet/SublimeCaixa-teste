document.addEventListener("DOMContentLoaded", function() {
    exibir_form("1"); //1 Mostra apenas o formulário de cadastro ao carregar | 2 Mostra a lista de serviços
});

function exibir_form(tipo){
    add_servico = document.getElementById('adicionar-servico');
    att_servico = document.getElementById('att_servico');

    if(tipo == "1"){
        att_servico.style.display = "none";
        add_servico.style.display = "block";
    } else if(tipo == "2"){
        add_servico.style.display = "none";
        att_servico.style.display = "block";
    }
}
// Funções para selecionar, editar e filtrar serviços
function dados_servico(id_servico){
    // Recebe o ID do serviço vindo do clique no botão
    csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

    //Oculta a barra de pesquisa e lista
    document.getElementById('search-bar-servico').style.display = 'none'; // faz sumir a barra
    document.getElementById('lista-servicos').style.display = 'none';
    // monta e envia o FormData com o ID correto
    data = new FormData(); // envia dados para o backend, dessa forma como um formulário
    data.append('id_servico', id_servico);

    //console.log("ID enviado:", id_servico);
    fetch("/servicos/atualiza_servico/", {
        method: "POST",
        headers: {
            'X-CSRFToken': csrf_token,
        },
        body: data
    })
    .then(response => {
        if (!response.ok) throw new Error('Resposta do servidor: ' + response.status);
        return response.json();
    })
    .then(data => {
        // mostra o formulário de edição
        document.getElementById('form-att-servico').style.display = 'block';
        // preenche formulario
        document.getElementById('id_servico').value = data.id;
        document.getElementById('nome').value = data.nome;
        document.getElementById('preco-edit').value = parseFloat(data.preco).toFixed(2);
    })
    .catch(error => {
        console.error('Erro ao carregar serviço:', error);

        //devolve a lista ao usuário para continuar
        if (barra) barra.style.display = '';
        if (lista) lista.style.display = '';
    });
}


function update_servico(){
    const btn = document.getElementById("btn-salvar-servico");

    btn.disabled = true;
    const originalText = btn.value;
    btn.value = "Salvando...";

    const id_servico = document.getElementById("id_servico").value;
    const nome = document.getElementById("nome").value.trim();
    const preco = document.getElementById("preco-edit").value.trim().replace(',', '.');
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;


    // Validação dos campos obrigatórios
    if (!nome || !preco) {
        alert("Por favor, preencha todos os campos obrigatórios."); // aparece a mensagem de erro
        btn.disabled = false; // faz com que o botão "atualizar" volte a funcionar
        btn.value = originalText;
        return;
    }

    fetch(`/servicos/update_servico/${id_servico}`, {
        method: "POST",
        headers: {
            'X-CSRFToken': csrf_token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            preco: preco
        })
    }).then(response => response.json()
    ).then(function(data) {
        if (data.status === "200"){
            const msg = document.getElementById("mensagem-sucesso-servico");
            msg.style.display = 'block';
            btn.value = "Salvando...";

        setTimeout(() => {
            msg.style.display = 'none';
            btn.disabled = false;
            btn.value = originalText;
            // Atualiza a lista sem reload
            listarServicos();
            // Esconde o formulario e mostra a lista
            document.getElementById('form-att-servico').style.display = 'none';
            document.getElementById('lista-servicos').style.display = 'block';

        }, 2000);
    } else {
        alert("Erro ao salvar alterações.");
        btn.disabled = false;
        btn.value = originalText;
        }
    }).catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro inesperado ao salvar.");
    }).finally(() => {
        setTimeout(() => {
            btn.disabled = false;
            btn.value = originalText;
        }, 1000);
    });
}

function editarServico(id) {
    //Habilita os campos
    document.getElementById(`nome-${id}`).disabled = false;
    document.getElementById(`preco-${id}`).disabled = false;

    //Mostra os botões de salvar/excluir
    document.getElementById(`acoes-${id}`).style.display = "flex";
}

// função para deixar valores formatados em 00,00€
function formatarPreco(preco) {
    // garante que seja numero
    let numero = Number(preco);
    if (isNaN(numero)) numero = 0;
    // Formata com 2 casas decimais e substitui ponto por virgula
    return numero.toFixed(2).replace('.', ',');
}

function salvarAlteracoes(id) {
    const card = document.getElementById(`servico-${id}`);
    const nome = card.querySelector(`.nome-${id}`).value;
    const preco = card.querySelector(`.preco-${id}`).value;


    const btnSalvar = document.querySelector(`#acoes-${id} .btn-salvar`);
    const textoOriginal = btnSalvar.textContent;
    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    fetch(`/servicos/update_servico/${id}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "200") {
            alert("Serviço atualizado com sucesso!")

            //Congela os campos novamente
            document.getElementById(`nome-${id}`).disabled = true;
            document.getElementById(`preco-${id}`).disabled = true;
            document.getElementById(`acoes-${id}`).style.display = "none";

            btnSalvar.textContent = "Salvo!";
            setTimeout(() => {
            btnSalvar.disabled = false;
            btnSalvar.textContent = textoOriginal;
            //location.reload(); // ou atualize os campos sem recarregar 
        }, 1500);
        } else {
            alert("Erro ao salvar alterações.");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Erro inesperado.");
        btnSalvar.disabled = false;
        btnSalvar.textContent = textoOriginal;
    });    
}



function excluirServico(id) {
    //abrir modal de confirmação
    const modal = document.getElementById('confirm-delete-modal');
    modal.style.display = 'flex';

    //limpar event listeners anteriores para evitar multiplos cliques
    const btnConfirm = document.getElementById('btn-confirm-delete');
    const btnCancel = document.getElementById('btn-cancel-delete');

    //Remove listeners anteriores
    btnConfirm.replaceWith(btnConfirm.cloneNode(true));
    btnCancel.replaceWith(btnCancel.cloneNode(true));

    //pegar os novos botões (clone)
    const newBtnConfirm = document.getElementById('btn-confirm-delete');
    const newBtnCancel = document.getElementById('btn-cancel-delete');

    newBtnConfirm.onclick = () => {
        modal.style.display = 'none';
        // continuar exclusão
        fetch (`/servicos/delete_servico/${id}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "200") {
                //remover botão da lista
                document.getElementById(`servico-${id}`).remove();
                location.reload();
                //mostrar mensagem de sucesso temporária
                const msg = document.getElementById('mensagem-sucesso-servico');
                msg.innerHTML = '<p>Serviço excluído com sucesso!</p>';
                msg.style.display = 'block';

                setTimeout(() => {
                    msg.style.display = 'none';
                    // limpar formulário após exclusão (opcional)
                    // limparFormularioServico();
                });
            } else {
                alert("Erro ao excluir.");
            }
        });
    };
    newBtnCancel.onclick = () => {
        modal.style.display = 'none';
    };    
}


function buscarServico () {
    const query = document.getElementById('search-bar-servico').value;

    if (query.lenght < 2) {
        document.getElementById('search-results-servico').innerHTML = '';
        return;
    }

    fetch(`/servicos/buscar/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultados = document.getElementById('search-results-servico');
            resultados.innerHTML = '';

            data.servicos.forEach(servico => {
                resultados.innerHTML += `
                    <button class="list-group-item"
                        onclick="selecionarServico(${servico.id}, '${servico.nome.replace(/'/g, "\\'")}')">
                        ${servico.nome} • ${formatarPreco(servico.preco)}€
                    </button>
                `;
            });
        });

        document.getElementById('lista-servicos').style.display = 'block';    
}
// opcional: selecionarServico chamado por resultados dinamicos
function selecionarServico(id, nome) {
    const searchBar = document.getElementById('search-bar-servico');
    if (searchBar) searchBar.value = nome;
    const resultados = document.getElementById('search-results-servico');
    if (resultados) { resultados.innerHTML = ''; resultados.style.display = 'none'; }
    dados_servico(id); // função que usa para preencher o formulário

}

function filtrarServicos() {
    const query = removerAcentos(document.getElementById('search-bar-servico').value.toLowerCase());
    const items = document.querySelectorAll('#lista-servicos .list-group-item');

    items.forEach((item) => {
        const texto = removerAcentos(item.textContent.toLowerCase());
        item.style.display = texto.includes(query) ? 'block' : 'none';
    });
}

function carregarServicos() {
    fetch ('/servicos/listar/')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('lista-servicos');
            container.innerHTML = '';

            data.servicos.forEach(servico => {
                const bloco = document.createElement('div');
                bloco.classList.add('border', 'p-2', 'mb-2', 'rounded');

                bloco.innerHTML = `
                    <strong>${servico.nome}</strong><br>
                    Preço: ${formatarPreco(servico.preco)}€<br>
                    <button class="btn btn-sm btn-primary mt-2" onclick="editarServico(${servico.id})">Editar</button>
                `;

                container.appendChild(bloco);
            });
        });
}

function voltarLista() {
    //Mostra barra e lista
    document.getElementById('search-bar-servico').style.display = 'block';
    document.getElementById('lista-servicos').style.display = 'block';
    // Oculta o formulario de edição
    document.getElementById('form-att-servico').style.display = 'none';
}

// Remove acentos na barra de pesquisa
function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Lista todos os serviços
function listarServicos() {
    fetch('/servicos/servicos/listar/')
        .then(response => response.json())
        .then(data => {
            const listaServicos = data.servicos; // pega o array
            // barra de pesquisa ao atualizar
            const lista = document.getElementById('lista-servicos');
            lista.innerHTML = ""; // limpa a lista atual
            document.getElementById('search-bar-servico').style.display = 'block';

            // Normaliza filtro
            //const filtroNormalizado = removerAcentos(filtro.toLowerCase());

            // Ordem alfabética ignorando acentos
            listaServicos.sort((a, b) => {
                const nomeA = removerAcentos(a.nome);
                const nomeB = removerAcentos(b.nome);
                return nomeA.localeCompare(nomeB);
            });

            listaServicos.forEach(servico => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'list-group-item list-group-item-action text-start';
                btn.id = `servico-${servico.id}`;
                btn.dataset.nome = servico.nome;
                btn.dataset.preco = servico.preco;
                // outros dados se precisar
                btn.onclick = () => dados_servico(servico.id, btn);

                //const precoFormatado = servico.preco.toString().replace('.', ',');
                const precoFormatado = parseFloat(servico.preco).toFixed(2).replace('.', ',');
                btn.textContent = `${servico.nome} • ${formatarPreco(servico.preco)}€`;
                lista.appendChild(btn);

            });
        })
        .catch(error => console.error("Erro ao listar serviços:", error));
}

// Filtro no campo de busca
document.getElementById('search-bar-servico').addEventListener('input', function() {
    const query = removerAcentos(this.value);
    const botoes = document.querySelectorAll('#lista-servicos button');

    botoes.forEach(btn => {
        const nomeServico = removerAcentos(btn.dataset.nome);
        if (nomeServico.includes(query)) {
            btn.style.display = '';
        } else {
            btn.style.display = 'none';
        }
    });
});

