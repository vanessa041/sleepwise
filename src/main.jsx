// main.jsx — PONTO DE ENTRADA da aplicação.
// É o primeiro arquivo que roda: ele "monta" o React dentro da página HTML.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css"; // estilos globais (tema, variáveis de cor, classes utilitárias)
import App from "./App.jsx";

// createRoot pega a <div id="root"> do index.html e renderiza o React ali dentro.
createRoot(document.getElementById("root")).render(
  // A ORDEM dos "wrappers" abaixo importa — cada um envolve o de dentro:
  <StrictMode>
    {/* StrictMode: ajuda a achar bugs em desenvolvimento (não afeta produção). */}
    <HashRouter>
      {/* HashRouter: habilita as rotas/URLs (/login, /dashboard...) usando # na URL.
          Necessário no GitHub Pages: sem servidor próprio, dar F5 em /dashboard
          daria 404. Com o # (ex.: /#/dashboard) as rotas funcionam sempre. */}
      <AuthProvider>
        {/* AuthProvider: disponibiliza o usuário logado para TODAS as telas. */}
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
