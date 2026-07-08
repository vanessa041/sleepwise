import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useRegistros } from "../hooks/useRegistros";
import {
  resumirRegistros, gerarRecomendacoes, classificarSono, classificarEstresse,
  CORES_QUALIDADE, CORES_ESTRESSE,
} from "../utils/metrics";
import { diaDaSemana } from "../utils/format";
import { IconMoon, IconWater, IconRun, IconBrain, ICON_MAP } from "../components/Icons";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import styles from "./Dashboard.module.css";

const STATUS_SONO = { boa: "Boa", moderada: "Moderada", ruim: "Ruim", "—": "—" };

export default function Dashboard() {
  const { user } = useAuth();
  // O hook busca os registros e já entrega os estados de carregando/erro prontos.
  const { registros, carregando, erro, recarregar } = useRegistros();
  const location = useLocation();
  // Mensagem de sucesso ("toast") que a tela de Registro pode ter enviado via navigate.
  const [toast, setToast] = useState(location.state?.toast || "");

  // Faz o toast sumir sozinho depois de 3,2s. O "return () => clearTimeout"
  // é a LIMPEZA do efeito (cancela o timer se o componente sair da tela antes).
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // useMemo: só recalcula o resumo/recomendações quando os dados mudam.
  // resumirRegistros faz as médias e a distribuição de qualidade (ver utils/metrics).
  const resumo = useMemo(() => resumirRegistros(registros), [registros]);
  const recomendacoes = useMemo(() => gerarRecomendacoes(resumo), [resumo]);

  // Prepara os dados no formato que o gráfico de barras espera (últimos 7 dias).
  const serie = useMemo(() => {
    return [...registros]
      .sort((a, b) => (a.data > b.data ? 1 : -1))
      .slice(-7)
      .map((r) => ({
        dia: diaDaSemana(r.data),
        sono: Number(r.horasSono) || 0,
        agua: Number(r.agua) || 0,
      }));
  }, [registros]);

  const distribuicao = useMemo(
    () => [
      { nome: "Boa", valor: resumo.distribuicao.boa, cor: CORES_QUALIDADE.boa },
      { nome: "Moderada", valor: resumo.distribuicao.moderada, cor: CORES_QUALIDADE.moderada },
      { nome: "Ruim", valor: resumo.distribuicao.ruim, cor: CORES_QUALIDADE.ruim },
    ],
    [resumo]
  );

  const estresseLabel = classificarEstresse(resumo.mediaEstresse);
  const gauge = [{ nome: "estresse", valor: resumo.mediaEstresse, fill: CORES_ESTRESSE[estresseLabel] }];

  // ESTADOS DA TELA: carregando -> spinner; erro -> aviso com botão de recarregar.
  // Só chega no conteúdo principal (return de baixo) se não estiver nenhum dos dois.
  if (carregando) return <Loader texto="Carregando seu resumo..." />;
  if (erro) return <div className={styles.page}><ErrorMessage mensagem={erro} onRetry={recarregar} /></div>;

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.head}>
        <div>
          <h1>Olá, {user?.nome}! 👋</h1>
          <p>Aqui está o resumo da sua saúde e sono.</p>
        </div>
        <Link to="/registro" className="btn-primary" style={{ width: "auto", padding: "10px 18px" }}>
          + Novo registro
        </Link>
      </header>

      {resumo.totalRegistros === 0 ? (
        <div className={styles.vazio}>
          <p>Você ainda não tem registros.</p>
          <Link to="/registro" className="btn-primary" style={{ maxWidth: 240, margin: "12px auto 0" }}>
            Fazer meu primeiro registro
          </Link>
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <section className={styles.cards}>
            <StatCard Icon={IconMoon} cor="sono" titulo="Horas de sono (média)"
              valor={resumo.mediaSono} unidade="h"
              status={STATUS_SONO[classificarSono(resumo.mediaSono)]}
              statusCor={CORES_QUALIDADE[classificarSono(resumo.mediaSono)]} />
            <StatCard Icon={IconWater} cor="agua" titulo="Água (média)"
              valor={resumo.mediaAgua} unidade="L"
              status={resumo.mediaAgua >= 2 ? "Bom" : "Moderado"}
              statusCor={resumo.mediaAgua >= 2 ? CORES_QUALIDADE.boa : CORES_QUALIDADE.moderada} />
            <StatCard Icon={IconRun} cor="ex" titulo="Exercício (média)"
              valor={resumo.mediaExercicio} unidade="min"
              status={resumo.mediaExercicio >= 20 ? "Bom" : "Baixo"}
              statusCor={resumo.mediaExercicio >= 20 ? CORES_QUALIDADE.boa : CORES_QUALIDADE.moderada} />
            <StatCard Icon={IconBrain} cor="stress" titulo="Nível de estresse"
              valor={resumo.mediaEstresse} unidade="/100"
              status={estresseLabel[0].toUpperCase() + estresseLabel.slice(1)}
              statusCor={CORES_ESTRESSE[estresseLabel]} />
          </section>

          {/* Gráfico de barras — sono na semana */}
          <section className="card" style={{ padding: 20, marginBottom: 18 }}>
            <h2 className={styles.chartTitle}>Evolução — Horas de sono</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={serie} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33285e" vertical={false} />
                <XAxis dataKey="dia" stroke="#8b83b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8b83b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139,92,246,0.1)" }}
                  formatter={(v) => [`${v}h`, "Sono"]} />
                <Bar dataKey="sono" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <div className={styles.duo}>
            {/* Distribuição da qualidade (donut) */}
            <section className="card" style={{ padding: 20 }}>
              <h2 className={styles.chartTitle}>Distribuição da qualidade do sono</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribuicao} dataKey="valor" nameKey="nome"
                    innerRadius={54} outerRadius={82} paddingAngle={3} stroke="none">
                    {distribuicao.map((d) => <Cell key={d.nome} fill={d.cor} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v} dia(s)`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <ul className={styles.legend}>
                {distribuicao.map((d) => (
                  <li key={d.nome}>
                    <span style={{ background: d.cor }} /> {d.nome} — {d.valor}
                  </li>
                ))}
              </ul>
            </section>

            {/* Gauge de estresse */}
            <section className="card" style={{ padding: 20 }}>
              <h2 className={styles.chartTitle}>Nível de estresse</h2>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={gauge}
                  startAngle={220} endAngle={-40}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: "#33285e" }} dataKey="valor" cornerRadius={12}
                    angleAxisId={0} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className={styles.gaugeVal}>
                <strong style={{ color: CORES_ESTRESSE[estresseLabel] }}>{resumo.mediaEstresse}</strong>
                <span>/100 · {estresseLabel}</span>
              </div>
            </section>
          </div>

          {/* Recomendações */}
          <section className="card" style={{ padding: 20 }}>
            <h2 className={styles.chartTitle}>Recomendações para você</h2>
            <ul className={styles.recs}>
              {recomendacoes.map((r, i) => {
                const Icon = ICON_MAP[r.icon] || IconMoon;
                return (
                  <li key={i}>
                    <span className={`${styles.recIcon} ${styles[r.icon]}`}><Icon width={18} height={18} /></span>
                    {r.texto}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

const tooltipStyle = {
  background: "#1f1840",
  border: "1px solid #33285e",
  borderRadius: 10,
  color: "#f5f3ff",
};
