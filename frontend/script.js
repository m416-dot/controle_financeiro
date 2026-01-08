const API_URL = "https://controle-financeiro-ydii.onrender.com";

// ==============================
// BUSCAR MOVIMENTAÇÕES (GET)
// ==============================
async function carregarMovimentacoes() {
    try {
        const response = await fetch(`${API_URL}/movimentacoes`);
        const dados = await response.json();

        atualizarTabela(dados);
    } catch (erro) {
        console.error("Erro ao carregar movimentações:", erro);
    }
}

// ==============================
// ADICIONAR MOVIMENTAÇÃO (POST)
// ==============================
async function adicionar() {
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;
    const valor = document.getElementById("valor").value;
    const descricao = document.getElementById("descricao").value;

    if (!tipo || !data || !valor) {
        alert("Preencha os campos obrigatórios");
        return;
    }

    try {
        await fetch(`${API_URL}/movimentacoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tipo,
                data,
                valor,
                descricao
            })
        });

        carregarMovimentacoes(); // recarrega a tabela
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
    }
}

// ==============================
// ATUALIZAR TABELA
// ==============================
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
