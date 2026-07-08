// Regras de negócio do SleepWise (definidas no documento do projeto).
// Mantidas isoladas aqui para ficarem fáceis de testar e reutilizar.

/**
 * Classifica a qualidade do sono a partir das horas dormidas.
 * >= 8h  -> boa | 6 a 7h -> moderada | < 6h -> ruim
 */
export function classificarSono(horasSono) {
  const h = Number(horasSono) || 0;
  if (h >= 8) return "boa";
  if (h >= 6) return "moderada";
  return "ruim";
}

/**
 * Estima o nível de estresse (0-100) segundo a lógica do projeto:
 *   sono < 6h        -> +40
 *   água < 2L        -> +20
 *   sem exercício    -> +20
 * A base começa em 20 (fatores não medidos) e é limitada a 100.
 */
export function estimarEstresse({ horasSono, agua, fezExercicio }) {
  let stress = 20;
  if ((Number(horasSono) || 0) < 6) stress += 40;
  if ((Number(agua) || 0) < 2) stress += 20;
  if (!fezExercicio) stress += 20;
  return Math.min(stress, 100);
}

/** Rótulo textual para o nível de estresse. */
export function classificarEstresse(valor) {
  if (valor <= 40) return "baixo";
  if (valor <= 70) return "moderado";
  return "alto";
}

/** Calcula horas de sono entre dois horários "HH:MM" (lida com virada de dia). */
export function calcularHorasSono(horaDormir, horaAcordar) {
  if (!horaDormir || !horaAcordar) return 0;
  const [hd, md] = horaDormir.split(":").map(Number);
  const [ha, ma] = horaAcordar.split(":").map(Number);
  let inicio = hd * 60 + md;
  let fim = ha * 60 + ma;
  if (fim <= inicio) fim += 24 * 60; // dormiu antes da meia-noite, acordou no dia seguinte
  return Math.round(((fim - inicio) / 60) * 10) / 10;
}

/** Cores associadas a cada classificação (usadas em cards e gráficos). */
export const CORES_QUALIDADE = {
  boa: "#22c55e",
  moderada: "#f59e0b",
  ruim: "#ef4444",
};

export const CORES_ESTRESSE = {
  baixo: "#22c55e",
  moderado: "#f59e0b",
  alto: "#ef4444",
};

/**
 * Agrega uma lista de registros nas métricas exibidas no dashboard:
 * médias, distribuição de qualidade e séries para os gráficos.
 */
export function resumirRegistros(registros) {
  if (!registros || registros.length === 0) {
    return {
      totalRegistros: 0,
      mediaSono: 0,
      mediaAgua: 0,
      mediaExercicio: 0,
      mediaEstresse: 0,
      qualidadeMedia: "—",
      distribuicao: { boa: 0, moderada: 0, ruim: 0 },
    };
  }

  const soma = registros.reduce(
    (acc, r) => {
      acc.sono += Number(r.horasSono) || 0;
      acc.agua += Number(r.agua) || 0;
      acc.exercicio += r.fezExercicio ? Number(r.duracaoExercicio) || 0 : 0;
      acc.estresse += estimarEstresse(r);
      const q = classificarSono(r.horasSono);
      acc.dist[q] += 1;
      return acc;
    },
    { sono: 0, agua: 0, exercicio: 0, estresse: 0, dist: { boa: 0, moderada: 0, ruim: 0 } }
  );

  const n = registros.length;
  const round = (v) => Math.round(v * 10) / 10;
  const mediaSono = round(soma.sono / n);

  return {
    totalRegistros: n,
    mediaSono,
    mediaAgua: round(soma.agua / n),
    mediaExercicio: Math.round(soma.exercicio / n),
    mediaEstresse: Math.round(soma.estresse / n),
    qualidadeMedia: classificarSono(mediaSono),
    distribuicao: soma.dist,
  };
}

/**
 * Gera recomendações personalizadas com base nas médias.
 */
export function gerarRecomendacoes(resumo) {
  const recs = [];
  if (resumo.mediaSono < 7) {
    recs.push({ icon: "sono", texto: "Tente dormir entre 7 e 9 horas por noite para melhorar o descanso." });
  } else {
    recs.push({ icon: "sono", texto: "Ótimo! Continue mantendo uma rotina de sono regular." });
  }
  if (resumo.mediaAgua < 2) {
    recs.push({ icon: "agua", texto: "Aumente seu consumo de água. O ideal é de 2 a 3 litros por dia." });
  } else {
    recs.push({ icon: "agua", texto: "Sua hidratação está boa. Mantenha o hábito ao longo do dia." });
  }
  if (resumo.mediaExercicio < 20) {
    recs.push({ icon: "exercicio", texto: "Inclua atividades físicas na rotina — ajudam no sono e reduzem o estresse." });
  } else {
    recs.push({ icon: "exercicio", texto: "Continue praticando exercícios regularmente. Isso melhora o sono!" });
  }
  return recs;
}
