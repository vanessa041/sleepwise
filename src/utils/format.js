// Helpers de formatação usados nas telas.

/** "2026-06-30" -> "30/06/2026" */
export function formatarData(iso) {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** "2026-06-30" -> "seg", "ter"... (rótulo curto do dia da semana) */
export function diaDaSemana(iso) {
  if (!iso) return "";
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const d = new Date(`${iso}T00:00:00`);
  return dias[d.getDay()];
}

/** Data de hoje no formato ISO local (YYYY-MM-DD), sem deslocamento de fuso. */
export function hojeISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export const EMOJIS_HUMOR = {
  pessimo: "😣",
  triste: "🙁",
  neutro: "😐",
  feliz: "🙂",
  otimo: "😄",
};

export const LABEL_HUMOR = {
  pessimo: "Péssimo",
  triste: "Triste",
  neutro: "Neutro",
  feliz: "Feliz",
  otimo: "Ótimo",
};

// aliases usados em registros de exemplo mais antigos
EMOJIS_HUMOR.cansado = "😫";
LABEL_HUMOR.cansado = "Cansado";
