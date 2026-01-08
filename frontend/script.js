const API_URL = "/movimentacoes";

// CARREGA AO ABRIR
document.addEventListener("DOMContentLoaded", carregarMovimentacoes);

function carregarMovimentacoes() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => atualizarTabela(dados))
        .catch(err => console.error("Erro ao buscar dados:", err));
}

function adicionar() {
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const valor = Number(document.getElementById("valor").value);
    const descricao = document.getElementById("descricao").value;

    if (!tipo || !data || !valor) {
        alert("Preencha os campos obrigatórios");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, data, valor, descricao })
    })
    .then(res => res.json())
    .then(() => {
        carregarMovimentacoes();
        limparFormulario();
    })
    .catch(err => console.error("Erro ao salvar:", err));
}

function atualizarTabela(lista) {
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    lista.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${item.tipo}</td>
                <td>${item.data}</td>
                <td>R$ ${item.valor}</td>
                <td>${item.descricao || ""}</td>
            </tr>
        `;
    });
}

function limparFormulario() {
    document.getElementById("tipo").value = "";
    document.getElementById("data").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("descricao").value = "";
}
