from flask import Flask, request, jsonify
import json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_FILE = "backend/data/produtos.json"


def carregar_produtos():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except:
        return []


def salvar_produtos(produtos):
    with open(DATA_FILE, "w") as f:
        json.dump(produtos, f, indent=4)


@app.route("/")
def home():
    return "ValiMarket API rodando 🚀"


@app.route("/produtos", methods=["GET"])
def listar_produtos():
    produtos = carregar_produtos()
    return jsonify(produtos)


@app.route("/produtos", methods=["POST"])
def adicionar_produto():
    data = request.json

    produto = {
        "nome": data["nome"],
        "validade": data["validade"],
        "preco": data["preco"],
        "precoDesconto": data["precoDesconto"]
    }

    produtos = carregar_produtos()
    produtos.append(produto)
    salvar_produtos(produtos)

    return jsonify({"msg": "Produto adicionado com sucesso"}), 201


@app.route("/produtos/proximos", methods=["GET"])
def produtos_proximos():
    produtos = carregar_produtos()
    hoje = datetime.now()

    proximos = []

    for p in produtos:
        validade = datetime.strptime(p["validade"], "%Y-%m-%d")
        dias = (validade - hoje).days

        if 0 <= dias <= 5:
            proximos.append(p)

    return jsonify(proximos)


if __name__ == "__main__":
    app.run(debug=True)