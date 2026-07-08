// ProtectedRoute.jsx — "porteiro" das telas privadas.
// Envolve as rotas que exigem login e decide se deixa passar ou não.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, carregando } = useAuth(); // pega usuário e status do contexto
  const location = useLocation();          // rota que a pessoa tentou abrir

  // 1) Ainda verificando a sessão salva? Mostra o "carregando" (evita piscar login).
  if (carregando) return <Loader texto="Verificando sessão..." />;

  // 2) Não está logado? Redireciona para /login.
  //    `state={{ from: location }}` lembra de onde a pessoa veio, para voltar
  //    para lá depois de logar (feito na tela de Login).
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // 3) Logado: libera o conteúdo protegido.
  return children;
}
