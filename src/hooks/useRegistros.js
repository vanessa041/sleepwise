// useRegistros.js — HOOK CUSTOMIZADO (função reutilizável que começa com "use").
// Ele encapsula toda a lógica de "buscar os registros do usuário" junto com os
// estados de CARREGANDO e ERRO. Assim, Dashboard, Relatórios e Perfil só chamam
// useRegistros() e recebem tudo pronto — sem repetir código.

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listarRegistros } from "../services/registrosService";
import { mensagemErro } from "../api/client";

export function useRegistros() {
  const { user } = useAuth(); // usuário logado (para filtrar os registros dele)

  // Três estados clássicos de uma requisição:
  const [registros, setRegistros] = useState([]);   // os dados em si
  const [carregando, setCarregando] = useState(true); // se está buscando
  const [erro, setErro] = useState("");                // mensagem de erro (se houver)

  // useCallback memoriza a função para ela não ser recriada a cada render.
  // Ela só muda quando o `user` muda.
  const carregar = useCallback(async () => {
    if (!user) return;      // sem usuário, não há o que buscar
    setCarregando(true);    // liga o "carregando"
    setErro("");            // limpa erro anterior
    try {
      const dados = await listarRegistros(user.id); // chama a API
      setRegistros(dados);                          // deu certo: guarda os dados
    } catch (err) {
      setErro(mensagemErro(err));                   // deu erro: guarda a mensagem
    } finally {
      setCarregando(false);                         // sempre desliga o "carregando"
    }
  }, [user]);

  // Dispara a busca assim que o hook é usado (e de novo se `carregar` mudar).
  useEffect(() => {
    carregar();
  }, [carregar]);

  // Devolve os dados e uma função `recarregar` (usada no botão "tentar de novo").
  return { registros, carregando, erro, recarregar: carregar };
}
