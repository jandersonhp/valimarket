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
        <strong>${p.nome}</strong><br>
        💰 De R$${p.preco} por <b>R$${p.precoDesconto}</b><br>
        ⏰ Vence em: ${p.validade}
      `;

      // destaque se estiver MUITO perto de vencer
      if (dias <= 2) {
        li.style.border = "2px solid red";
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