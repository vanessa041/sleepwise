import styles from "./Loader.module.css";

// Indicador de carregamento reutilizado em todas as telas com requisições.
export default function Loader({ texto = "Carregando..." }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span>{texto}</span>
    </div>
  );
}
