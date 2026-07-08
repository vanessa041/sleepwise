// client.js — configuração ÚNICA do Axios (biblioteca que faz as requisições HTTP).
// Todo o app fala com o backend através deste "api", então a URL base e o
// tratamento de erro ficam centralizados em um lugar só.

import axios from "axios";

// Endereço do backend (JSON Server). Em produção, o Vite lê a variável
// VITE_API_URL; em desenvolvimento, usa o localhost na porta 3001.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Cria uma instância do Axios já configurada (base, cabeçalho JSON e
// timeout de 8s para não travar a tela se o servidor não responder).
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Converte QUALQUER erro técnico do Axios em uma mensagem clara em português.
// As telas chamam esta função para mostrar um aviso amigável ao usuário.
export function mensagemErro(err) {
  // Estourou o timeout de 8s.
  if (err.code === "ECONNABORTED") return "Tempo de conexão esgotado. Tente novamente.";
  // O servidor respondeu, mas com erro (ex.: 404, 500).
  if (err.response) {
    if (err.response.status === 404) return "Registro não encontrado.";
    return `Erro no servidor (${err.response.status}).`;
  }
  // A requisição saiu mas não houve resposta (servidor desligado).
  if (err.request) {
    return "Não foi possível conectar ao servidor. Verifique se o JSON Server está rodando (npm run server).";
  }
  // Qualquer outro caso inesperado.
  return "Ocorreu um erro inesperado.";
}

export default api;
