// registrosService.js — todas as chamadas REST dos "registros diários".
// Cada função corresponde a um VERBO HTTP (GET/POST/PUT/DELETE), formando
// o CRUD completo (Create, Read, Update, Delete) exigido na avaliação.
// Manter as chamadas aqui deixa os componentes limpos (eles só chamam a função).

import api from "../api/client";

// READ (lista): GET /registros?userId=... traz os registros de UM usuário.
// O { data } "desestrutura" a resposta do Axios (o corpo vem em resp.data).
// Depois ordenamos por data, do mais recente para o mais antigo.
export async function listarRegistros(userId) {
  const { data } = await api.get("/registros", { params: { userId } });
  return [...data].sort((a, b) => (a.data < b.data ? 1 : -1));
}

// READ (um item): GET /registros/:id — busca um registro específico.
export async function obterRegistro(id) {
  const { data } = await api.get(`/registros/${id}`);
  return data;
}

// CREATE: POST /registros — cria um novo registro (o servidor gera o id).
export async function criarRegistro(registro) {
  const { data } = await api.post("/registros", registro);
  return data;
}

// UPDATE: PUT /registros/:id — substitui o registro inteiro pelo novo.
// Reenviamos o id junto no corpo para o JSON Server manter o mesmo id.
export async function atualizarRegistro(id, registro) {
  const { data } = await api.put(`/registros/${id}`, { ...registro, id });
  return data;
}

// DELETE: DELETE /registros/:id — apaga o registro. Retornamos o id apagado
// para a tela conseguir removê-lo da lista sem recarregar tudo.
export async function excluirRegistro(id) {
  await api.delete(`/registros/${id}`);
  return id;
}
