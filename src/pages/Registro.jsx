// Registro.jsx — tela de CRIAR um registro diário (a parte "Create" do CRUD).
// Ela só cuida do envio; o formulário em si está no componente RegistroForm.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { criarRegistro } from "../services/registrosService";
import { mensagemErro } from "../api/client";
import TopBar from "../components/TopBar";
import RegistroForm from "../components/RegistroForm";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./Registro.module.css";

export default function Registro() {
  const { user } = useAuth();       // para saber de quem é o registro (userId)
  const navigate = useNavigate();   // para trocar de tela após salvar
  const [enviando, setEnviando] = useState(false); // trava o botão durante o envio
  const [erro, setErro] = useState("");            // mensagem de erro, se houver

  // Recebe os dados já validados do RegistroForm e envia para a API.
  async function handleSubmit(dados) {
    setEnviando(true);
    setErro("");
    try {
      // Junta os dados do formulário com o id do usuário logado e cria (POST).
      await criarRegistro({ ...dados, userId: user.id });
      // Deu certo: vai para o dashboard e manda uma mensagem de sucesso (toast).
      navigate("/dashboard", { state: { toast: "Registro salvo com sucesso!" } });
    } catch (err) {
      setErro(mensagemErro(err)); // deu erro: mostra o aviso
    } finally {
      setEnviando(false);         // libera o botão de novo
    }
  }

  return (
    <div className={styles.page}>
      <TopBar titulo="Registro diário" subtitulo={`Olá, ${user?.nome}! Preencha seus hábitos de hoje.`} />
      {/* Só mostra o erro se ele existir (curto-circuito com &&). */}
      {erro && <ErrorMessage mensagem={erro} onRetry={() => setErro("")} />}
      <div className="card" style={{ padding: 22, marginTop: 4 }}>
        {/* Passamos a função handleSubmit para o formulário chamar ao salvar. */}
        <RegistroForm onSubmit={handleSubmit} enviando={enviando} textoBotao="Salvar registro" />
      </div>
    </div>
  );
}
