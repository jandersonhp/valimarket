const API = "http://127.0.0.1:5000";

const form = document.getElementById("formProduto");
const lista = document.getElementById("listaProdutos");

// ===============================
// CADASTRO DE PRODUTO (EMPRESA)
// ===============================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = {
      empresa: document.getElementById("empresa").value,
      nome: document.getElementById("nome").value,
      validade: document.getElementById("validade").value,
      preco: parseFloat(document.getElementById("preco").value),
      precoDesconto: parseFloat(document.getElementById("precoDesconto").value)
    };

    try {
      await fetch(API + "/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
      });

      alert("Produto cadastrado com sucesso!");
      form.reset();
      carregarProdutos();

    } catch (erro) {
      console.error("Erro ao cadastrar produto:", erro);
      alert("Erro ao cadastrar produto");
    }
  });
}

// ===============================
// LISTAR PRODUTOS (CLIENTE)
// ===============================
async function carregarProdutos() {
  if (!lista) return;

  try {
    const res = await fetch(API + "/produtos/proximos");
    const produtos = await res.json();

    lista.innerHTML = "";

    const hoje = new Date();

    produtos.forEach(p => {
      const li = document.createElement("li");

      const validade = new Date(p.validade);
      const dias = (validade - hoje) / (1000 * 60 * 60 * 24);

li.innerHTML = `
  <div style="display:flex; flex-direction:column; gap:5px;">
    <strong style="font-size:16px;">${p.nome}</strong>
    <span>🏪 ${p.empresa}</span>
    <span>💰 <s>R$${p.preco}</s> → <b style="color:green;">R$${p.precoDesconto}</b></span>
    <span>⏰ Vence: ${p.validade}</span>
  </div>
`;

      // destaque se estiver MUITO perto de vencer
if (dias <= 2) {
  li.style.background = "#ffe6e6";
}

      lista.appendChild(li);
    });

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

// ===============================
// INICIALIZAÇÃO
// ===============================
carregarProdutos();