// Relatorio.jsx — tela de DETALHE de um registro. Concentra três partes do CRUD:
// Read (buscar o registro pelo id), Update (editar) e Delete (excluir).
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obterRegistro, atualizarRegistro, excluirRegistro } from "../services/registrosService";
import { mensagemErro } from "../api/client";
import { classificarSono, estimarEstresse, classificarEstresse, CORES_QUALIDADE, CORES_ESTRESSE } from "../utils/metrics";
import { formatarData } from "../utils/format";
import TopBar from "../components/TopBar";
import RegistroForm from "../components/RegistroForm";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { IconTrash, IconEdit } from "../components/Icons";
import styles from "./Relatorio.module.css";

export default function Relatorio() {
  // useParams lê o ":id" da URL (ex.: /relatorio/abc123 -> id = "abc123").
  const { id } = useParams();
  const navigate = useNavigate();

  // Vários estados para controlar a tela:
  const [registro, setRegistro] = useState(null);      // o registro carregado
  const [carregando, setCarregando] = useState(true);  // buscando os dados?
  const [erro, setErro] = useState("");                // mensagem de erro
  const [editando, setEditando] = useState(false);     // modo edição ligado?
  const [salvando, setSalvando] = useState(false);     // salvando/excluindo?
  const [confirmar, setConfirmar] = useState(false);   // mostrando "tem certeza?"

  // READ: busca o registro pelo id. useCallback evita recriar a função à toa.
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setRegistro(await obterRegistro(id));
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  // Ao abrir a tela (ou mudar o id), carrega o registro.
  useEffect(() => { carregar(); }, [carregar]);

  // UPDATE: mescla o registro atual com os campos editados e salva (PUT).
  async function handleAtualizar(dados) {
    setSalvando(true);
    setErro("");
    try {
      const atualizado = await atualizarRegistro(id, { ...registro, ...dados });
      setRegistro(atualizado); // atualiza a tela com o retorno da API
      setEditando(false);      // sai do modo edição
    } catch (err) {
      setErro(mensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  // DELETE: apaga o registro e volta para a lista de relatórios.
  async function handleExcluir() {
    setSalvando(true);
    try {
      await excluirRegistro(id);
      navigate("/relatorios", { replace: true });
    } catch (err) {
      setErro(mensagemErro(err));
      setSalvando(false);
    }
  }

  // "Early returns": mostram estados especiais antes do conteúdo principal.
  if (carregando) return <Loader texto="Carregando registro..." />;
  if (erro && !registro) return <div className={styles.page}><TopBar titulo="Relatório" /><ErrorMessage mensagem={erro} onRetry={carregar} /></div>;
  if (!registro) return null;

  // Valores derivados: calculados a partir do registro para exibir na tela.
  const q = classificarSono(registro.horasSono);        // "boa" | "moderada" | "ruim"
  const estresse = estimarEstresse(registro);           // número 0-100
  const estresseLabel = classificarEstresse(estresse);  // "baixo" | "moderado" | "alto"

  return (
    <div className={styles.page}>
      <TopBar
        titulo={`Registro de ${formatarData(registro.data)}`}
        subtitulo={editando ? "Editando registro" : "Detalhes do dia"}
        direita={
          !editando && (
            <button className={styles.iconBtn} onClick={() => setEditando(true)} aria-label="Editar">
              <IconEdit width={18} height={18} />
            </button>
          )
        }
      />

      {erro && <ErrorMessage mensagem={erro} onRetry={() => setErro("")} />}

      {/* Ternário: se `editando` for true mostra o FORMULÁRIO (modo edição),
          senão mostra os DETALHES do registro (modo leitura). */}
      {editando ? (
        <div className="card" style={{ padding: 22 }}>
          <RegistroForm inicial={registro} onSubmit={handleAtualizar} enviando={salvando}
            textoBotao="Salvar alterações" />
          <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <section className={styles.resumo}>
            <div className={styles.destaque} style={{ borderColor: CORES_QUALIDADE[q] }}>
              <span>Qualidade do sono</span>
              <strong style={{ color: CORES_QUALIDADE[q] }}>{q}</strong>
            </div>
            <div className={styles.destaque} style={{ borderColor: CORES_ESTRESSE[estresseLabel] }}>
              <span>Nível de estresse</span>
              <strong style={{ color: CORES_ESTRESSE[estresseLabel] }}>{estresse}/100</strong>
            </div>
          </section>

          <section className="card" style={{ padding: 20 }}>
            <dl className={styles.dados}>
              <div><dt>Hora de dormir</dt><dd>{registro.horaDormir}</dd></div>
              <div><dt>Hora de acordar</dt><dd>{registro.horaAcordar}</dd></div>
              <div><dt>Horas de sono</dt><dd>{registro.horasSono}h</dd></div>
              <div><dt>Água consumida</dt><dd>{registro.agua}L</dd></div>
              <div><dt>Exercício</dt><dd>{registro.fezExercicio ? "Sim" : "Não"}</dd></div>
              {registro.fezExercicio && (
                <>
                  <div><dt>Tipo</dt><dd>{registro.tipoExercicio || "—"}</dd></div>
                  <div><dt>Duração</dt><dd>{registro.duracaoExercicio} min</dd></div>
                </>
              )}
            </dl>
          </section>

          {confirmar ? (
            <div className={styles.confirmar}>
              <p>Tem certeza que deseja excluir este registro?</p>
              <div className={styles.confirmBtns}>
                <button className={styles.danger} onClick={handleExcluir} disabled={salvando}>
                  {salvando ? "Excluindo..." : "Sim, excluir"}
                </button>
                <button className="btn-ghost" onClick={() => setConfirmar(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button className={styles.excluir} onClick={() => setConfirmar(true)}>
              <IconTrash width={18} height={18} /> Excluir registro
            </button>
          )}
        </>
      )}
    </div>
  );
}
