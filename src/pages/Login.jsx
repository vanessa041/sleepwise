import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import { IconEye } from "../components/Icons";
import styles from "./Auth.module.css";

// Login.jsx — tela de entrada. Usa a função `entrar` do contexto de autenticação.
export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Se o usuário foi mandado para cá pelo ProtectedRoute, `from` guarda a página
  // que ele queria abrir — voltamos para lá após o login (senão, vai pro dashboard).
  const destino = location.state?.from?.pathname || "/dashboard";

  // Um estado para cada campo do formulário + controle de exibir senha/erro/envio.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false); // olho: mostra/esconde a senha
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();   // não recarrega a página
    setErro("");
    setEnviando(true);
    try {
      await entrar(email.trim(), senha);       // tenta logar (chama a API)
      navigate(destino, { replace: true });    // sucesso: vai para a tela destino
    } catch (err) {
      // err.friendly é a mensagem amigável definida no authService.
      setErro(err.friendly || "Não foi possível entrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Brand size="md" />
          <p className={styles.tagline}>Entenda seus hábitos, melhore seu sono.</p>
        </div>

        <div className={styles.welcome}>
          <h2>Bem-vindo de volta!</h2>
          <p>Faça login para continuar</p>
        </div>

        {erro && <div className={styles.formError}>{erro}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className={styles.pwWrap}>
              <input id="senha" type={verSenha ? "text" : "password"} placeholder="••••••••"
                value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <button type="button" className={styles.pwToggle}
                onClick={() => setVerSenha((v) => !v)} aria-label="Mostrar senha">
                <IconEye width={20} height={20} />
              </button>
            </div>
          </div>

          <Link to="/login" className={styles.forgot}>Esqueceu sua senha?</Link>

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.divider}>ou</div>
        <Link to="/cadastro" className="btn-ghost" style={{ display: "block", textAlign: "center" }}>
          Criar conta
        </Link>

        <p className={styles.hint}>Conta de teste — ana@email.com / 123456</p>
      </div>
    </div>
  );
}
