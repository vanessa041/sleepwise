// AuthProvider.jsx — o "cérebro" da autenticação (Context API).
// Guarda QUEM está logado e as funções de entrar/cadastrar/sair, e
// compartilha tudo isso com o app inteiro (sem precisar passar props
// de tela em tela). A sessão fica salva no navegador (localStorage),
// então o usuário continua logado mesmo se recarregar a página.

import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../services/authService";

// Chave usada para gravar/ler o usuário no localStorage do navegador.
const STORAGE_KEY = "sleepwise:user";

export function AuthProvider({ children }) {
  // user = objeto do usuário logado (ou null se ninguém logou).
  const [user, setUser] = useState(null);
  // carregando = true enquanto ainda estamos lendo a sessão salva.
  // Evita "piscar" a tela de login antes de saber se já havia sessão.
  const [carregando, setCarregando] = useState(true);

  // useEffect com [] roda UMA vez, quando o app abre:
  // tenta recuperar a sessão salva no localStorage.
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) setUser(JSON.parse(salvo)); // texto salvo -> objeto JS
    } catch {
      localStorage.removeItem(STORAGE_KEY); // dado corrompido: descarta
    }
    setCarregando(false); // terminou de verificar
  }, []);

  // Salva o usuário no estado E no localStorage (login "persistente").
  function persistir(u) {
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); // objeto -> texto
  }

  // entrar/registrar chamam o serviço (que fala com a API) e, se der certo,
  // guardam o usuário retornado. `await` espera a resposta da API.
  async function entrar(email, senha) {
    const u = await authService.login(email, senha);
    persistir(u);
    return u;
  }

  async function registrar(dados) {
    const u = await authService.cadastrar(dados);
    persistir(u);
    return u;
  }

  // Atualiza os dados do perfil do usuário logado.
  async function salvarPerfil(dados) {
    const u = await authService.atualizarPerfil(user.id, dados);
    persistir(u);
    return u;
  }

  // Logout: limpa o estado e apaga a sessão salva.
  function sair() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  // useMemo evita recriar este objeto a cada render sem necessidade;
  // ele só muda quando `user` ou `carregando` mudam. Tudo que está aqui
  // fica disponível para quem usar o hook useAuth().
  const value = useMemo(
    () => ({ user, carregando, entrar, registrar, salvarPerfil, sair }),
    [user, carregando]
  );

  // O Provider "injeta" o value para todos os componentes filhos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
