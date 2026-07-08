import styles from "./Brand.module.css";

// Logotipo do SleepWise: lua com "Z" (sono) e o wordmark em dois tons.
export default function Brand({ size = "md" }) {
  return (
    <div className={`${styles.brand} ${styles[size]}`}>
      <div className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="60%" height="60%" fill="none"
          stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span className={styles.z}>z</span>
      </div>
      <h1 className={styles.word}>
        Sleep<span>Wise</span>
      </h1>
    </div>
  );
}
