import { Link } from "react-router-dom";
import { useRegistros } from "../hooks/useRegistros";
import { classificarSono, estimarEstresse, CORES_QUALIDADE } from "../utils/metrics";
import { formatarData, EMOJIS_HUMOR } from "../utils/format";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { IconMoon, IconWater, IconRun } from "../components/Icons";
import styles from "./Relatorios.module.css";

// Relatorios.jsx — LISTA (histórico) de todos os registros do usuário.
// É a parte "Read (lista)" do CRUD e o ponto de entrada para ver o detalhe.
export default function Relatorios() {
  const { registros, carregando, erro, recarregar } = useRegistros();

  if (carregando) return <Loader texto="Carregando registros..." />;

  return (
    <div className={styles.page}>
      <TopBar titulo="Relatórios" subtitulo="Histórico dos seus registros diários" voltar={false} />

      {/* Três situações encadeadas: erro -> lista vazia -> lista com itens. */}
      {erro ? (
        <ErrorMessage mensagem={erro} onRetry={recarregar} />
      ) : registros.length === 0 ? (
        <div className={styles.vazio}>
          <p>Nenhum registro por aqui ainda.</p>
          <Link to="/registro" className="btn-primary" style={{ maxWidth: 220, margin: "12px auto 0" }}>
            Criar registro
          </Link>
        </div>
      ) : (
        <ul className={styles.lista}>
          {/* Para cada registro, cria um item da lista que leva ao detalhe.
              A `key={r.id}` é obrigatória em listas para o React se organizar. */}
          {registros.map((r) => {
            const q = classificarSono(r.horasSono);   // qualidade do sono do dia
            const estresse = estimarEstresse(r);       // estresse estimado do dia
            return (
              <li key={r.id}>
                <Link to={`/relatorio/${r.id}`} className={styles.item}>
                  <div className={styles.data}>
                    <span className={styles.emoji}>{EMOJIS_HUMOR[r.humor] || "😐"}</span>
                    <div>
                      <strong>{formatarData(r.data)}</strong>
                      <span className={styles.badge} style={{ color: CORES_QUALIDADE[q] }}>
                        Sono {q}
                      </span>
                    </div>
                  </div>
                  <div className={styles.metrics}>
                    <span><IconMoon width={15} height={15} /> {r.horasSono}h</span>
                    <span><IconWater width={15} height={15} /> {r.agua}L</span>
                    <span><IconRun width={15} height={15} /> {r.fezExercicio ? `${r.duracaoExercicio}min` : "—"}</span>
                    <span className={styles.estresse}>Estresse {estresse}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
