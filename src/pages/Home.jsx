import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import { IconMoon, IconWater, IconRun, IconBrain } from "../components/Icons";
import styles from "./Home.module.css";

const destaques = [
  { Icon: IconMoon, cor: "sono", titulo: "Registre seu sono", texto: "Acompanhe quantas horas você dorme e a qualidade do seu descanso." },
  { Icon: IconWater, cor: "agua", titulo: "Hidratação", texto: "Monitore seu consumo de água ao longo dos dias." },
  { Icon: IconRun, cor: "ex", titulo: "Exercícios", texto: "Registre atividades físicas e veja o impacto no seu bem-estar." },
  { Icon: IconBrain, cor: "stress", titulo: "Nível de estresse", texto: "Receba uma estimativa do seu estresse e recomendações." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <Brand size="lg" />
        <p className={styles.sub}>
          O SleepWise ajuda você a entender como seus hábitos diários — sono, água e
          exercícios — influenciam sua saúde física e mental.
        </p>
        <div className={styles.cta}>
          <Link to="/login" className="btn-primary" style={{ maxWidth: 200 }}>Entrar</Link>
          <Link to="/cadastro" className="btn-ghost" style={{ maxWidth: 200 }}>Criar conta</Link>
        </div>
      </header>

      <section className={styles.grid}>
        {destaques.map(({ Icon, cor, titulo, texto }) => (
          <article key={titulo} className={styles.feature}>
            <span className={`${styles.chip} ${styles[cor]}`}><Icon width={22} height={22} /></span>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>Sistema Inteligente de Monitoramento do Sono e Bem-Estar · caráter informativo</p>
      </footer>
    </div>
  );
}
