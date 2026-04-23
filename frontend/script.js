const API = "http://127.0.0.1:5000";

const form = document.getElementById("formProduto");
const lista = document.getElementById("listaProdutos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produto = {
    nome: document.getElementById("nome").value,
    validade: document.getElementById("validade").value,
    preco: parseFloat(document.getElementById("preco").value),
    precoDesconto: parseFloat(document.getElementById("precoDesconto").value)
  };

  await fetch(API + "/produtos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
  });

  form.reset();
  carregarProdutos();
});

async function carregarProdutos() {
  const res = await fetch(API + "/produtos/proximos");
  const produtos = await res.json();

  lista.innerHTML = "";

  produtos.forEach(p => {
    const li = document.createElement("li");
li.innerHTML = `
  <strong>${p.nome}</strong><br>
  💰 De R$${p.preco} por R$${p.precoDesconto}<br>
  ⏰ Vence em: ${p.validade}
`;
    lista.appendChild(li);
  });
}

carregarProdutos();