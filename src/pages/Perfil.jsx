import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRegistros } from "../hooks/useRegistros";
import { mensagemErro } from "../api/client";
import TopBar from "../components/TopBar";
import styles from "./Perfil.module.css";

// Perfil.jsx — dados do usuário, edição das metas e botão de sair (logout).
export default function Perfil() {
  const { user, salvarPerfil, sair } = useAuth();
  const { registros } = useRegistros(); // usado só para mostrar quantos registros tem
  const navigate = useNavigate();

  // Campos começam com os valores atuais do usuário. O "??" usa o padrão (8, 2.5)
  // caso a meta ainda não exista.
  const [nome, setNome] = useState(user?.nome || "");
  const [metaSono, setMetaSono] = useState(user?.metaSono ?? 8);
  const [metaAgua, setMetaAgua] = useState(user?.metaAgua ?? 2.5);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false); // mostra "salvo!" por alguns segundos

  // Salva as alterações do perfil (chama salvarPerfil do contexto -> PATCH na API).
  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setOk(false);
    try {
      await salvarPerfil({ nome: nome.trim(), metaSono: Number(metaSono), metaAgua: Number(metaAgua) });
      setOk(true);
      setTimeout(() => setOk(false), 2500); // esconde o aviso "salvo!" depois de 2,5s
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  // Logout: limpa a sessão e volta para o login.
  function handleSair() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className={styles.page}>
      <TopBar titulo="Perfil" subtitulo="Seus dados e metas" voltar={false} />

      <div className={styles.avatarRow}>
        <div className={styles.avatar}>{(user?.nome || "?")[0].toUpperCase()}</div>
        <div>
          <strong>{user?.nome}</strong>
          <span>{user?.email}</span>
          <span className={styles.count}>{registros.length} registro(s)</span>
        </div>
      </div>

      <form className="card" style={{ padding: 22 }} onSubmit={handleSalvar}>
        {erro && <div className={styles.formError}>{erro}</div>}
        {ok && <div className={styles.formOk}>Perfil atualizado!</div>}

        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className={styles.row}>
          <div className="field">
            <label htmlFor="ms">Meta de sono (h)</label>
            <input id="ms" type="number" step="0.5" min="0" value={metaSono}
              onChange={(e) => setMetaSono(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="ma">Meta de água (L)</label>
            <input id="ma" type="number" step="0.1" min="0" value={metaAgua}
              onChange={(e) => setMetaAgua(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <button className={styles.sair} onClick={handleSair}>Sair da conta</button>
    </div>
  );
}
