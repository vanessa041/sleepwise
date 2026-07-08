import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "./Icons";
import styles from "./TopBar.module.css";

// Cabeçalho das telas internas: botão voltar + título/subtítulo + slot à direita.
export default function TopBar({ titulo, subtitulo, voltar = true, direita }) {
  const navigate = useNavigate();
  return (
    <header className={styles.bar}>
      {voltar && (
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="Voltar">
          <IconArrowLeft width={20} height={20} />
        </button>
      )}
      <div className={styles.titles}>
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {direita && <div className={styles.right}>{direita}</div>}
    </header>
  );
}
