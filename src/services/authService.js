// authService.js — funções de autenticação usando a coleção `users` do JSON Server.
// IMPORTANTE: é uma autenticação SIMPLES, para fins didáticos — a senha é comparada
// em texto puro e não há token real. Em um sistema de produção usaríamos hash de
// senha e autenticação por token (isso está documentado no README).

import api from "../api/client";

// LOGIN: busca os usuários com aquele e-mail e confere a senha.
export async function login(email, senha) {
  const { data } = await api.get("/users", { params: { email } });
  const user = data.find((u) => u.email === email && u.senha === senha);
  if (!user) {
    // Cria um erro com uma mensagem "amigável" para a tela mostrar.
    const err = new Error("Credenciais inválidas");
    err.friendly = "E-mail ou senha incorretos.";
    throw err;
  }
  // Remove a senha antes de devolver o usuário (não guardamos senha na tela).
  // O "..." (rest) copia todos os campos MENOS a senha para o objeto `safe`.
  const { senha: _omit, ...safe } = user;
  return safe;
}

// CADASTRO: impede e-mail duplicado e cria o usuário com metas padrão.
export async function cadastrar({ nome, email, senha }) {
  const { data } = await api.get("/users", { params: { email } });
  if (data.some((u) => u.email === email)) {
    const err = new Error("E-mail já cadastrado");
    err.friendly = "Este e-mail já está em uso.";
    throw err;
  }
  // POST cria o novo usuário no backend (metas de sono/água como padrão inicial).
  const { data: novo } = await api.post("/users", {
    nome,
    email,
    senha,
    metaSono: 8,
    metaAgua: 2.5,
  });
  const { senha: _omit, ...safe } = novo; // devolve sem a senha
  return safe;
}

// ATUALIZAR PERFIL: PATCH altera SÓ os campos enviados (nome, metas...).
export async function atualizarPerfil(id, dados) {
  const { data } = await api.patch(`/users/${id}`, dados);
  const { senha: _omit, ...safe } = data;
  return safe;
}
