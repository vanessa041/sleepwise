import axios from "axios";
import seed from "../../db.json";

// Se VITE_API_URL estiver definida, falamos com um backend real via Axios.
const baseURL = import.meta.env.VITE_API_URL;

// Converte QUALQUER erro em uma mensagem clara em português.
// As telas chamam esta função para mostrar um aviso amigável ao usuário.
export function mensagemErro(err) {
  if (err?.code === "ECONNABORTED") return "Tempo de conexão esgotado. Tente novamente.";
  if (err?.response) {
    if (err.response.status === 404) return "Registro não encontrado.";
    return `Erro no servidor (${err.response.status}).`;
  }
  if (err?.request) {
    return "Não foi possível conectar ao servidor.";
  }
  return err?.friendly || "Ocorreu um erro inesperado.";
}

// ────────────────────────────────────────────────────────────────────────
// BACKEND DE MENTIRA (localStorage) — usado quando não há VITE_API_URL.
// ────────────────────────────────────────────────────────────────────────

const STORE_KEY = "sleepwise:db";

// Lê o "banco" do localStorage; na primeira vez, semeia com o db.json.
function carregarDB() {
  try {
    const salvo = localStorage.getItem(STORE_KEY);
    if (salvo) return JSON.parse(salvo);
  } catch {
    // dado corrompido: recomeça do seed
  }
  const inicial = {
    users: (seed.users || []).map((u) => ({ ...u })),
    registros: (seed.registros || []).map((r) => ({ ...r })),
  };
  salvarDB(inicial);
  return inicial;
}

function salvarDB(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

// Gera um id curto (como o JSON Server faz por padrão).
function gerarId() {
  return Math.random().toString(36).slice(2, 10);
}

// Simula o atraso de rede e devolve no formato do Axios ({ data }).
function resposta(data) {
  return Promise.resolve({ data });
}

// Cria um erro no "formato Axios" para o mensagemErro reconhecer (ex.: 404).
function erroHttp(status) {
  const err = new Error(`HTTP ${status}`);
  err.response = { status };
  return err;
}

// Divide "/registros/abc?x=1" em { colecao: "registros", id: "abc" }.
function parseUrl(url) {
  const semQuery = url.split("?")[0];
  const partes = semQuery.split("/").filter(Boolean); // remove vazios
  return { colecao: partes[0], id: partes[1] };
}

// Filtra a coleção pelos params passados (ex.: { email } ou { userId }).
function filtrarPorParams(itens, params = {}) {
  const chaves = Object.keys(params).filter((k) => params[k] !== undefined);
  if (chaves.length === 0) return itens;
  return itens.filter((item) => chaves.every((k) => String(item[k]) === String(params[k])));
}

const mockApi = {
  async get(url, config = {}) {
    const db = carregarDB();
    const { colecao, id } = parseUrl(url);
    const itens = db[colecao] || [];
    if (id) {
      const achado = itens.find((i) => String(i.id) === String(id));
      if (!achado) throw erroHttp(404);
      return resposta(achado);
    }
    return resposta(filtrarPorParams(itens, config.params));
  },

  async post(url, body) {
    const db = carregarDB();
    const { colecao } = parseUrl(url);
    if (!db[colecao]) db[colecao] = [];
    const novo = { ...body, id: body?.id ?? gerarId() };
    db[colecao].push(novo);
    salvarDB(db);
    return resposta(novo);
  },

  async put(url, body) {
    const db = carregarDB();
    const { colecao, id } = parseUrl(url);
    const itens = db[colecao] || [];
    const idx = itens.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) throw erroHttp(404);
    const atualizado = { ...body, id: itens[idx].id };
    itens[idx] = atualizado;
    salvarDB(db);
    return resposta(atualizado);
  },

  async patch(url, body) {
    const db = carregarDB();
    const { colecao, id } = parseUrl(url);
    const itens = db[colecao] || [];
    const idx = itens.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) throw erroHttp(404);
    const atualizado = { ...itens[idx], ...body, id: itens[idx].id };
    itens[idx] = atualizado;
    salvarDB(db);
    return resposta(atualizado);
  },

  async delete(url) {
    const db = carregarDB();
    const { colecao, id } = parseUrl(url);
    const itens = db[colecao] || [];
    db[colecao] = itens.filter((i) => String(i.id) !== String(id));
    salvarDB(db);
    return resposta({});
  },
};

// Se houver VITE_API_URL, usa Axios de verdade; senão, o mock local.
const api = baseURL
  ? axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    })
  : mockApi;

export default api;
