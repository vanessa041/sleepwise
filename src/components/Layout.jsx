// Layout.jsx — a "moldura" das telas privadas: mostra o conteúdo da rota atual
// e a barra de navegação inferior fixa (Dashboard, Registro, Relatórios, Perfil).
import { NavLink, Outlet } from "react-router-dom";
import { IconHome, IconEdit, IconChart, IconUser } from "./Icons";
import styles from "./Layout.module.css";

// Lista dos botões do menu inferior (destino, rótulo e ícone de cada um).
const itens = [
  { to: "/dashboard", label: "Dashboard", Icon: IconChart },
  { to: "/registro", label: "Registro", Icon: IconEdit },
  { to: "/relatorios", label: "Relatórios", Icon: IconHome },
  { to: "/perfil", label: "Perfil", Icon: IconUser },
];

export default function Layout() {
  return (
    <div className={styles.shell}>
      <main className={styles.content}>
        {/* <Outlet /> é onde o React Router encaixa a tela da rota atual
            (Dashboard, Registro, etc.), mantendo o menu abaixo sempre visível. */}
        <Outlet />
      </main>

      <nav className={styles.nav} aria-label="Navegação principal">
        {/* NavLink é como um link, mas sabe quando está "ativo" (rota atual) —
            usamos isso para destacar o botão da tela em que o usuário está. */}
        {itens.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
          >
            <Icon width={22} height={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
