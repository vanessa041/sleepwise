// Ícones em SVG inline — evitam dependências extras e herdam a cor via `color`.
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const IconMoon = (p) => (
  <svg {...base} {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
);
export const IconWater = (p) => (
  <svg {...base} {...p}><path d="M12 2.7s6 6.13 6 10.3a6 6 0 0 1-12 0C6 8.83 12 2.7 12 2.7z" /></svg>
);
export const IconRun = (p) => (
  <svg {...base} {...p}><circle cx="13" cy="4" r="2" /><path d="M4 17l4-1 2-4 3 2 1 4" /><path d="M10 12l-2-3 4-2 3 3 3 1" /></svg>
);
export const IconBrain = (p) => (
  <svg {...base} {...p}><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 5" /></svg>
);
export const IconHome = (p) => (
  <svg {...base} {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);
export const IconEdit = (p) => (
  <svg {...base} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);
export const IconChart = (p) => (
  <svg {...base} {...p}><path d="M3 3v18h18" /><rect x="7" y="10" width="3" height="7" /><rect x="12" y="6" width="3" height="11" /><rect x="17" y="13" width="3" height="4" /></svg>
);
export const IconUser = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
);
export const IconBell = (p) => (
  <svg {...base} {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
);
export const IconMenu = (p) => (
  <svg {...base} {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
export const IconArrowLeft = (p) => (
  <svg {...base} {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconTrash = (p) => (
  <svg {...base} {...p}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
);

// Mapa nome->componente, útil para renderizar recomendações dinamicamente.
export const ICON_MAP = {
  sono: IconMoon,
  agua: IconWater,
  exercicio: IconRun,
  estresse: IconBrain,
};
