import styles from "./StatCard.module.css";

// Card de métrica do topo do dashboard (ícone, valor, status colorido).
export default function StatCard({ Icon, cor, titulo, valor, unidade, status, statusCor }) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={`${styles.chip} ${styles[cor]}`}><Icon width={20} height={20} /></span>
        <span className={styles.titulo}>{titulo}</span>
      </div>
      <div className={styles.valor}>
        {valor}
        {unidade && <small>{unidade}</small>}
      </div>
      {status && (
        <span className={styles.status} style={{ color: statusCor }}>
          ● {status}
        </span>
      )}
    </div>
  );
}
