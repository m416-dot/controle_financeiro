const API_URL = "https://controle-financeiro-ydii.onrender.com/movimentacoes";

// CARREGA AO ABRIR
document.addEventListener("DOMContentLoaded", carregarMovimentacoes);

function carregarMovimentacoes() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar dados");
            return res.json();
        })
        .then(dados => atualizarTabela(dados))
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar movimentações");
        });
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
    .then(res => {
        if (!res.ok) throw new Error("Erro ao salvar");
        return res.json();
    })
    .then(() => {
        carregarMovimentacoes();
        limparFormulario();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao salvar movimentação");
    });
}

function atualizarTabela(lista) {
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    lista.forEach(item => {
        tabela.innerHTML += `
            <tr>
                <td>${item.tipo}</td>
                <td>${item.data}</td>
                <td>R$ ${Number(item.valor).toFixed(2)}</td>
                <td>${item.descricao || ""}</td>
            </tr>
        `;
    });
}

function limparFormulario() {
    document.getElementById("tipo").value = "Receita";
    document.getElementById("data").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("descricao").value = "";
}
