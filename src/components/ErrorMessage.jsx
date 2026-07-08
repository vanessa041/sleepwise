import styles from "./ErrorMessage.module.css";

// Bloco padrão de erro com opção de "tentar novamente".
export default function ErrorMessage({ mensagem, onRetry }) {
  return (
    <div className={styles.box} role="alert">
      <span className={styles.icon}>⚠️</span>
      <p>{mensagem || "Algo deu errado."}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
