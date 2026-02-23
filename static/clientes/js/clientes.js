function exibir_form(tipo){
    add_cliente = document.getElementById('adicionar-cliente')
    att_cliente = document.getElementById('att_cliente')

    if(tipo == "1"){
        att_cliente.style.display = "none"
        add_cliente.style.display = "block"
    } else if(tipo == "2"){
        add_cliente.style.display = "none"
        att_cliente.style.display = "block"
    }

     
}

function dados_cliente(id){  // busca e preenche os dados do cliente ao editar
    csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value

    //Oculta a barra de pesquisa e lista
    document.getElementById('search-bar').style.display = 'none'; // faz sumir a barra
    document.getElementById('lista-clientes').style.display = 'none';

    fetch(`/clientes/dados_cliente/${id}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('form-att-cliente').style.display = 'block'; // Mostra o formulário de edição

        document.getElementById('id_cliente').value = data.id;
        const btnOcultar = document.querySelector('.ocultar-cliente');
        if (btnOcultar) {
            btnOcultar.dataset.id = data.id;
        }
        document.getElementById('edit-nome').value = data.nome;
        document.getElementById('edit-telefone').value = data.telefone;
        document.getElementById('edit-nascimento').value = data.nascimento;
        document.getElementById('edit-email').value = data.email;
        document.getElementById('edit-nif').value = data.nif;

        document.getElementById('ficha-container').style.display = 'block'; // mostra a ficha só quando tem o cliente
        const ficha = document.getElementById('fichaCliente');
        if (ficha) ficha.classList.remove('show');
        carregarFichas(data.id); // carrega o histórico desse cliente

    })

    .catch(error => {
        console.error('Erro ao buscar cliente:', error);
        alert('Erro ao buscar dados do cliente. Tente novamente.');
    });
    document.getElementById('lista-clientes').style.display = 'none';

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            //Procura pelo nome do cookie
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function update_cliente(){  // envia alterações para o backend | atualiza os dados via fetch com POST
    
    const btn = document.getElementById("btn-salvar-alteracoes");
    const msg = document.getElementById("mensagem-sucesso");

    const originalText = btn.value;
    btn.disabled = true; //desativa o botão
    btn.value = "Salvando..."; //troca o texto do botão

    // Limpa erros anteriores
    document.querySelectorAll('#form-att-cliente .form-control').forEach(el => {
        el.classList.remove('is-invalid');
    });
    document.querySelectorAll('#form-att-cliente .invalid-feedback').forEach(el => {
        el.innerHTML = '';
    });

    let nome = document.getElementById('edit-nome').value
    let telefone = itiEdicao.getNumber(); // inclui o ddi
    let nascimento = document.getElementById('edit-nascimento').value
    let email = document.getElementById('edit-email').value
    let nif = document.getElementById('edit-nif').value
    let id = document.getElementById('id_cliente').value

    // Validação NIF (Client-side)
    let nifNumeros = nif.replace(/\D/g, '');
    if (nifNumeros.length !== 9) {
        const input = document.getElementById('edit-nif');
        input.classList.add('is-invalid');
        input.nextElementSibling.innerHTML = 'O NIF deve conter 9 dígitos.';
        btn.disabled = false;
        btn.value = originalText;
        return;
    }

    fetch('/clientes/update_cliente/' + id, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrf_token,
        },
        body: JSON.stringify({ //outra forma de enviar os dados para o backend
            nome: nome,
            telefone: telefone,
            nascimento: nascimento,
            email: email,
            nif: nif
        })

        })
        
        .then(response => response.json())
        .then(data => {
            //Zera os erros anteriores
            document.querySelectorAll('#form-att-cliente .form-control').forEach(el => {
                el.classList.remove('is-invalid');
            });
            document.querySelectorAll('#form-att-cliente .invalid-feedback').forEach(el => {
                el.innerHTML = '';
            });
            //Se tiver erro de validação
            if (data.status === 'erro') {
            //Aplica os novos erros da edição
                if (data.erros['erro_edit-nome']) {
                    const input = document.getElementById('edit-nome');
                    input.classList.add('is-invalid');
                    input.nextElementSibling.innerHTML = data.erros['erro_edit-nome'];
                }
                if (data.erros['erro_edit-telefone']) {
                    const input = document.getElementById('edit-telefone');
                    input.classList.add('is-invalid');
                    const divErro = document.getElementById('erro_edit-telefone');
                    if(divErro){
                        divErro.innerHTML = data.erros['erro_edit-telefone'];
                        divErro.style.display = 'block';
                    }    
                }
                if (data.erros['erro_edit-nif']) {
                    const input = document.getElementById('edit-nif');
                    input.classList.add('is-invalid');
                    input.nextElementSibling.innerHTML = data.erros['erro_edit-nif'];
                }
                if (data.erros['erro_edit-nascimento']) {
                    const input = document.getElementById('edit-nascimento');
                    input.classList.add('is-invalid');
                    input.nextElementSibling.innerHTML = data.erros['erro_edit-nascimento'];
                }
                return;
            }


            //Tudo certo
            // Exibe a mensagem de sucesso 
            msg.style.display = "block";
            btn.value = "Salvo!";
            // Esconde a mensagem e reativa o botão depois de 2s
            setTimeout(() => {
                msg.style.display = "none";
                btn.value = originalText;
                btn.disabled = false; // reativa o botão
                listarClientes();
                voltarParaLista();
            }, 2000);

        })

    
        .catch(error => {
            console.error("Erro na requisição:", error);
            btn.value = originalText;
            btn.disabled = false; // reativa botão em caso de erro também
        });
}

document.addEventListener('DOMContentLoaded', () => {
    listarClientes();
})

function buscarCliente() {
    const query = document.getElementById('search-bar').value;

    if (query.length < 2) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    fetch(`/clientes/buscar/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultados = document.getElementById('search-results');
            resultados.innerHTML = '';

            data.clientes.forEach(cliente => { 
                resultados.innerHTML += `
                    <button class="list-group-item"  
                            onclick="selecionarCliente(${cliente.id}, '${cliente.nome.replace(/'/g, "\\'")}')">
                        ${cliente.nome} • ${cliente.telefone} • ${cliente.nif}
                    </button>`;

            });


        });
        document.getElementById('lista-clientes').style.display = 'block';
}


function selecionarCliente(id, nome) {
    const searchBar = document.getElementById('search-bar');
    searchBar.value = nome;
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('search-results').style.display = 'none';
    dados_cliente(id);

// Garante que se quiser digitar outro, as sugestões aparecem
searchBar.dispatchEvent(new Event('input'));
}

let todosClientes = [];

function carregarClientes() {
    fetch('clientes/listar/')
        .then(response => response.json())
        .then(data => {
            todosClientes = data.clientes;
            exibirClientes(todosClientes);
        });
}

function exibirClientes(clientes) {
    const container = document.getElementById('lista-clientes');
    container.innerHTML = '';

    if (clientes.length === 0) {
        container.innerHTML = '<p>Nenhum cliente encontrado.</p>';
        return;
    }
    clientes.forEach(cliente => {
        const bloco = document.createElement('div');
        bloco.classList.add('border', 'p-2', 'mb-2', 'rounded');

        bloco.innerHTML = `
            <strong>${cliente.nome}</strong><br>
            Telefone: ${cliente.telefone}<br>
            NIF: ${cliente.nif}<br>
            <button class="btn btn-sm btn-primary mt-2" onclick="editarCliente(${cliente.id})">Editar</button>
        `;

        container.appendChild(bloco);   
    });
}

function filtrarClientes() {
    const query = removerAcentos(document.getElementById("search-bar").value.toLowerCase());
    const botoes = document.querySelectorAll("#lista-clientes .list-group-item");

    botoes.forEach(btn => {
        const texto = removerAcentos(btn.textContent.toLowerCase());
        btn.style.display = texto.includes(query) ? "block" : "none";
    });
}

function habilitarEdicaoCliente() {
    // Habilita os campos do formulário
    document.getElementById('edit-nome').disabled = false;
    document.getElementById('edit-telefone').disabled = false;
    document.getElementById('edit-nif').disabled = false;
    document.getElementById('edit-nascimento').disabled = false;
    document.getElementById('edit-email').disabled = false;

    // Esconde o botão "Editar dados"
    document.getElementById('btn-editar-dados').style.display = 'none';

    // Mostra os botões "Salvar alterações" e "Excluir"
    document.getElementById('btn-salvar-alteracoes').style.display = 'inline-block';
    document.getElementById('btn-excluir-cliente').style.display = 'inline-block';
}

function voltarParaLista() {
    // Mostra barra e lista
    document.getElementById('search-bar').style.display = 'block';
    document.getElementById('lista-clientes').style.display = 'block';
    // Oculta o formulário de edição
    document.getElementById('form-att-cliente').style.display = 'none';
    document.getElementById('ficha-container').style.display = 'none';

    // Reseta o estado do formulário para "congelado"
    document.getElementById('edit-nome').disabled = true;
    document.getElementById('edit-telefone').disabled = true;
    document.getElementById('edit-nif').disabled = true;
    document.getElementById('edit-nascimento').disabled = true;
    document.getElementById('edit-email').disabled = true;

    document.getElementById('btn-editar-dados').style.display = 'inline-block';
    document.getElementById('btn-salvar-alteracoes').style.display = 'none';
    document.getElementById('btn-excluir-cliente').style.display = 'inline-block';
}

function removerAcentos(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function listarClientes() {
  fetch('/clientes/clientes/listar/') 
    .then(response => response.json())
    .then(clientes => {
      // barra de pesquisa ao atualizar   
      const lista = document.getElementById('lista-clientes');
      lista.innerHTML = ''; // limpa a lista atual
      document.getElementById('search-bar').style.display = 'block';
      document.getElementById('ficha-container').style.display = 'none';
    
      // Ordenar ignorando acentos
      clientes.sort((a, b) => {
        const nomeA = removerAcentos(a.nome);
        const nomeB = removerAcentos(b.nome);
        return nomeA.localeCompare(nomeB);
      });

      clientes.forEach(cliente => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'list-group-item list-group-item-action text-start';
        btn.id = `cliente-${cliente.id}`;
        btn.dataset.nome = cliente.nome;
        btn.dataset.telefone = cliente.telefone;
        btn.dataset.nif = cliente.nif;
        // outros dados se precisar...
        // btn.onclick = () => dados_cliente(cliente.id, btn);
        btn.onclick = () => selecionarCliente(cliente.id, cliente.nome, btn);
        btn.textContent = `${cliente.nome} • ${cliente.telefone} • NIF: ${cliente.nif}`;
        lista.appendChild(btn);
      });
    })
    .catch(err => console.error('Erro ao listar clientes:', err));
}

// 3. Filtro para clientes - faz a barra pesquisar por nome, telefone e nif
document.getElementById('search-bar').addEventListener('input', function() {
  const query = removerAcentos(this.value).toLowerCase();
  const botoes = document.querySelectorAll('#lista-clientes button');

  botoes.forEach(btn => {
    const nomeCliente = removerAcentos(btn.dataset.nome).toLowerCase();
    const telefoneCliente = (btn.dataset.telefone || '').toLowerCase();
    const nifCliente = (btn.dataset.nif || '').toLowerCase();

    if (nomeCliente.includes(query) || telefoneCliente.includes(query) || nifCliente.includes(query)) {
      btn.style.display = '';
    } else {
      btn.style.display = 'none';
    }
  });
});


function adicionarFicha(event) {
    event.preventDefault();
    const form = document.getElementById('form-ficha');
    // checar campos obrigatórios
    const data = form.querySelector('[name="data"]').value.trim();
    const profissional = form.querySelector('[name="profissional"]').value.trim();
    const valor = form.querySelector('[name="valor"]').value.trim();

    if (!data || !valor) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
        const formData = new FormData(form);
        //const clienteId = form.querySelector('[name="id_cliente"]').value;
        const clienteId = document.getElementById('id_cliente').value;



        fetch(`/clientes/${clienteId}/ficha/adicionar/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'ok') {
                // adiciona ficha no histórico
                document.getElementById('historico-fichas').insertAdjacentHTML('afterbegin', data.html_ficha);
                // mostra mensagem de sucesso
                const msg = document.createElement('div');
                msg.className = 'alert alert-success mt-3';
                msg.textContent = 'Ficha adicionada com sucesso!';
                form.parentNode.insertBefore(msg, form);
                

                //esconde a mensagem após 2s
                setTimeout(() => {
                    msg.remove()
                }, 2000);
                form.reset(); // limpa o formulário
            }    
        })
        .catch(err => {
            console.error(err);
            alert('Erro ao adicionar ficha. Tente novamente.');
        });
    };


// associa o botão ao clique
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('#form-ficha button[type="button"]');
    btn.addEventListener('click', adicionarFicha);
});

function carregarFichas(clienteId) {
    fetch(`/clientes/${clienteId}/detalhe`, { headers: { 'X-Requested-With': 'XMLHttpRequest' }})
        .then(r => r.text())
        .then(html => {
            document.getElementById('historico-fichas').innerHTML = html;
        })
        .catch(console.error);
}

function selecionarCliente(id, nome) {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.value = nome;
    }
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }

    dados_cliente(id);
    //console.log('Cliente selecionado:', id, nome);
}
// excluir ficha do cliente
document.addEventListener('click', function(event) {
    const btnExcluir = event.target.closest('.btn-excluir-ficha');
    if(btnExcluir) {
        event.preventDefault();
        const fichaId = btnExcluir.dataset.id;
        if(confirm('Tem certeza que deseja excluir esta ficha?')) {
            fetch(`/clientes/ficha/${fichaId}/excluir/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(res => res.json())
            .then(data => {
                if(data.status === 'ok') {
                    //remove do html
                    const fichaDiv = document.getElementById(`ficha-${data.ficha_id}`);
                    if (fichaDiv) {
                        fichaDiv.remove();
                    }
                } else {
                    alert(data.mensagem || 'Erro ao excluir ficha');
                }
            })
            .catch(console.error);
        }
    }
});


function ocultarCliente(id, event) {
    if (event) event.preventDefault(); // impede submit // COLOQUEI ISSO AQUI E EVENT NA FUNCTION
    // abrir modal
    const modal = document.getElementById('confirm-hide-modal');
    modal.style.display = 'flex';

    //limpar event listeners anteriores
    const btnConfirm = document.getElementById('btn-confirm-hide');
    const btnCancel = document.getElementById('btn-cancel-hide');
    btnConfirm.replaceWith(btnConfirm.cloneNode(true));
    btnCancel.replaceWith(btnCancel.cloneNode(true));

    //pegar os novos botões (clone)
    const newBtnConfirm = document.getElementById('btn-confirm-hide');
    const newBtnCancel = document.getElementById('btn-cancel-hide');

    //confirmar
    newBtnConfirm.onclick = () => {
        modal.style.display = 'none';
        // continuar ocultação
        fetch (`/clientes/${id}/ocultar/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                //remove e mostra listagem de clientes
                voltarParaLista();
            } else {
                alert('Erro: ' + data.error);
            }
        });
    };
    //cancelar
    newBtnCancel.onclick = () => {
        modal.style.display = 'none';
    };
}

function abrirModalEdicaoFicha(fichaId) {
    fetch(`/clientes/ficha/${fichaId}/detalhes/`)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            const ficha = data.ficha;
            document.getElementById('edit-ficha-id').value = ficha.id;
            document.getElementById('edit-ficha-data').value = ficha.data;
            document.getElementById('edit-ficha-profissional').value = ficha.profissional;
            
            // Formata o valor para exibição (ex: 1.234,56)
            let valorFormatado = parseFloat(ficha.valor).toFixed(2).replace('.', ',');
            valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            document.getElementById('edit-ficha-valor').value = valorFormatado;

            document.getElementById('edit-ficha-procedimento').value = ficha.procedimento;
            document.getElementById('edit-ficha-homecare').value = ficha.homecare;
            document.getElementById('edit-ficha-observacao').value = ficha.observacao;

            // Usando jQuery para abrir o modal (padrão do projeto)
            $('#modalEditarFicha').modal('show');
        } else {
            alert('Erro ao carregar dados da ficha.');
        }
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao carregar dados da ficha.');
    });
}

function salvarEdicaoFicha() {
    const fichaId = document.getElementById('edit-ficha-id').value;
    const csrf_token = getCookie('csrftoken');

    const data = {
        data: document.getElementById('edit-ficha-data').value,
        profissional: document.getElementById('edit-ficha-profissional').value,
        valor: document.getElementById('edit-ficha-valor').value,
        procedimento: document.getElementById('edit-ficha-procedimento').value,
        homecare: document.getElementById('edit-ficha-homecare').value,
        observacao: document.getElementById('edit-ficha-observacao').value,
    };

    fetch(`/clientes/ficha/${fichaId}/update/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'ok') {
            $('#modalEditarFicha').modal('hide');
            const clienteId = document.getElementById('id_cliente').value;
            carregarFichas(clienteId); // Recarrega o histórico para mostrar a alteração
        } else {
            alert('Erro ao salvar: ' + (result.mensagem || 'Verifique os dados.'));
        }
    })
    .catch(error => {
        console.error('Erro ao salvar ficha:', error);
        alert('Ocorreu um erro inesperado ao salvar.');
    });
}