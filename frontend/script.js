const API_URL = "http://localhost:3000/movimentacoes";

// CARREGA DADOS AO ABRIR A PÁGINA
document.addEventListener("DOMContentLoaded", carregarMovimentacoes);

function carregarMovimentacoes() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => {
            atualizarTabela(dados);
        })
        .catch(err => console.error("Erro ao buscar dados:", err));
}

function adicionar() {
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const valor = document.getElementById("valor").value;
    const descricao = document.getElementById("descricao").value;

    const novaMovimentacao = {
        tipo,
        data,
        valor,
        descricao
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaMovimentacao)
    })
        .then(res => res.json())
        .then(() => {
            carregarMovimentacoes(); // recarrega tabela
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
