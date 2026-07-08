// App.jsx — MAPA DE ROTAS da aplicação.
// Aqui definimos qual componente (tela) aparece para cada endereço (URL).

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Registro from "./pages/Registro";
import Relatorios from "./pages/Relatorios";
import Relatorio from "./pages/Relatorio";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

// Componente auxiliar: se o usuário JÁ está logado e tenta abrir uma página
// pública (login/cadastro/home), mandamos ele direto para o dashboard.
// `children` é o conteúdo que o componente "abraça" (a tela pública).
function SomenteVisitante({ children }) {
  const { user } = useAuth(); // lê o usuário do contexto global
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    // <Routes> escolhe UMA <Route> para renderizar, conforme a URL atual.
    <Routes>
      {/* ---- ROTAS PÚBLICAS (qualquer um acessa) ---- */}
      <Route path="/" element={<SomenteVisitante><Home /></SomenteVisitante>} />
      <Route path="/login" element={<SomenteVisitante><Login /></SomenteVisitante>} />
      <Route path="/cadastro" element={<SomenteVisitante><Cadastro /></SomenteVisitante>} />

      {/* ---- ROTAS PROTEGIDAS (só com login) ----
          Esta <Route> "pai" não tem path: ela só aplica o ProtectedRoute
          (verifica o login) + o Layout (menu inferior). As rotas "filhas"
          abaixo aparecem dentro do <Outlet /> do Layout. */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/relatorios" element={<Relatorios />} />
        {/* ":id" é um parâmetro dinâmico — vira o id do registro na URL. */}
        <Route path="/relatorio/:id" element={<Relatorio />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* ---- PÁGINA 404 ----
          "*" casa com qualquer URL que não bateu com as de cima. */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
