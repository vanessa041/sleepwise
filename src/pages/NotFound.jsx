import { Link } from "react-router-dom";
import { IconMoon } from "../components/Icons";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.icon}><IconMoon width={54} height={54} /></span>
      <h1>404</h1>
      <p>Ops! Esta página foi dormir e não foi encontrada.</p>
      <Link to="/" className="btn-primary" style={{ maxWidth: 220 }}>Voltar ao início</Link>
    </div>
  );
}
