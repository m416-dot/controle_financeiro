const API_URL = "https://controle-financeiro-ydii.onrender.com/movimentacoes";

async function carregarMovimentacoes() {
    try {
        const response = await fetch(API_URL);
        const dados = await response.json();
        atualizarTabela(dados);
    } catch (erro) {
        console.error("Erro ao carregar movimentações:", erro);
    }
}

function adicionar() {
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const valor = document.getElementById("valor").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tipo, data, valor, descricao })
    })
    .then(() => carregarMovimentacoes())
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

document.addEventListener("DOMContentLoaded", carregarMovimentacoes);
