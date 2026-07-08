import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";
import { IconEye } from "../components/Icons";
import styles from "./Auth.module.css";

// Cadastro.jsx — tela de criar conta. Valida os dados antes de enviar à API.
export default function Cadastro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  // Um único estado `form` guarda os 4 campos juntos.
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirma: "" });
  const [verSenha, setVerSenha] = useState(false);
  const [erros, setErros] = useState({});       // erros por campo
  const [erroGeral, setErroGeral] = useState(""); // erro geral (ex.: e-mail já existe)
  const [enviando, setEnviando] = useState(false);

  // Atualiza um campo mantendo os demais.
  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Validação: nome preenchido, e-mail com formato válido (regex), senha com
  // no mínimo 6 caracteres e confirmação igual à senha.
  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Informe seu nome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
    if (form.senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    if (form.senha !== form.confirma) e.confirma = "As senhas não coincidem.";
    setErros(e);
    return Object.keys(e).length === 0; // true se não houve nenhum erro
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroGeral("");
    if (!validar()) return; // não envia se a validação falhou
    setEnviando(true);
    try {
      await registrar({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha });
      navigate("/dashboard", { replace: true }); // já entra logado no dashboard
    } catch (err) {
      setErroGeral(err.friendly || "Não foi possível criar a conta.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Brand size="md" />
          <p className={styles.tagline}>Crie sua conta e comece a cuidar do seu sono.</p>
        </div>

        <div className={styles.welcome}>
          <h2>Criar conta</h2>
          <p>É rápido e gratuito</p>
        </div>

        {erroGeral && <div className={styles.formError}>{erroGeral}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" type="text" placeholder="Seu nome"
              className={erros.nome ? "invalid" : ""}
              value={form.nome} onChange={(e) => set("nome", e.target.value)} />
            {erros.nome && <span className="error-text">{erros.nome}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" placeholder="seu@email.com"
              className={erros.email ? "invalid" : ""}
              value={form.email} onChange={(e) => set("email", e.target.value)} />
            {erros.email && <span className="error-text">{erros.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className={styles.pwWrap}>
              <input id="senha" type={verSenha ? "text" : "password"} placeholder="••••••••"
                className={erros.senha ? "invalid" : ""}
                value={form.senha} onChange={(e) => set("senha", e.target.value)} />
              <button type="button" className={styles.pwToggle}
                onClick={() => setVerSenha((v) => !v)} aria-label="Mostrar senha">
                <IconEye width={20} height={20} />
              </button>
            </div>
            {erros.senha && <span className="error-text">{erros.senha}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirma">Confirmar senha</label>
            <input id="confirma" type={verSenha ? "text" : "password"} placeholder="••••••••"
              className={erros.confirma ? "invalid" : ""}
              value={form.confirma} onChange={(e) => set("confirma", e.target.value)} />
            {erros.confirma && <span className="error-text">{erros.confirma}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Criando..." : "Cadastrar"}
          </button>
        </form>

        <p className={styles.foot}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
