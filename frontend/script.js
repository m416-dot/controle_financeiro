const API_URL = "https://controle-financeiro-ydii.onrender.com/movimentacoes";

document.addEventListener("DOMContentLoaded", carregar);

function carregar() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => renderizar(dados));
}

function adicionar() {
    const tipo = tipoEl().value;
    const data = dataEl().value;
    const valor = Number(valorEl().value);
    const descricao = descEl().value;

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, data, valor, descricao })
    })
    .then(() => carregar());
}

function renderizar(lista) {
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

const tipoEl = () => document.getElementById("tipo");
const dataEl = () => document.getElementById("data");
const valorEl = () => document.getElementById("valor");
const descEl = () => document.getElementById("descricao");
