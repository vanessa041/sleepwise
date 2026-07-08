// RegistroForm.jsx — FORMULÁRIO CONTROLADO (o React é o "dono" dos valores dos
// campos). É reaproveitado em dois lugares: criar um registro novo (tela Registro)
// e editar um existente (tela Relatório) — por isso recebe `inicial` e `onSubmit`.
import { useMemo, useState } from "react";
import { IconMoon, IconWater, IconRun } from "./Icons";
import { calcularHorasSono } from "../utils/metrics";
import { EMOJIS_HUMOR, LABEL_HUMOR, hojeISO } from "../utils/format";
import styles from "./RegistroForm.module.css";

// Opções fixas exibidas no formulário (humor e tipos de exercício).
const HUMORES = ["pessimo", "triste", "neutro", "feliz", "otimo"];
const TIPOS = ["Musculação", "Corrida", "Caminhada", "Yoga", "Ciclismo", "Natação", "Outro"];

// Valores iniciais quando é um registro NOVO (sem dados vindos de fora).
const vazio = {
  data: hojeISO(),
  horaDormir: "23:00",
  horaAcordar: "07:00",
  agua: 2,
  fezExercicio: false,
  tipoExercicio: "",
  duracaoExercicio: 30,
  humor: "neutro",
};

// Props recebidas: inicial (dados p/ edição), onSubmit (o que fazer ao salvar),
// enviando (trava o botão durante o envio) e o texto do botão.
export default function RegistroForm({ inicial, onSubmit, enviando, textoBotao = "Salvar registro" }) {
  // `form` guarda TODOS os campos. Começa com os valores vazios e, se vier
  // `inicial` (edição), sobrescreve por cima com o "...inicial".
  const [form, setForm] = useState({ ...vazio, ...inicial });
  const [erros, setErros] = useState({}); // mensagens de erro por campo

  // useMemo recalcula as horas de sono só quando os horários mudam
  // (evita refazer a conta a cada tecla digitada em outro campo).
  const horasSono = useMemo(
    () => calcularHorasSono(form.horaDormir, form.horaAcordar),
    [form.horaDormir, form.horaAcordar]
  );

  // Atualiza UM campo do formulário sem perder os outros (o "...f" copia o resto).
  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  // Verifica os campos e monta um objeto de erros. Retorna true se estiver tudo ok.
  function validar() {
    const e = {};
    if (!form.data) e.data = "Informe a data.";
    if (!form.horaDormir) e.horaDormir = "Informe o horário.";
    if (!form.horaAcordar) e.horaAcordar = "Informe o horário.";
    if (form.agua === "" || Number(form.agua) < 0) e.agua = "Valor inválido.";
    if (Number(form.agua) > 20) e.agua = "Valor muito alto.";
    if (form.fezExercicio && Number(form.duracaoExercicio) <= 0)
      e.duracaoExercicio = "Informe a duração.";
    setErros(e);
    return Object.keys(e).length === 0; // sem chaves = sem erros
  }

  // Ao enviar: bloqueia o recarregamento da página, valida e, se ok, chama onSubmit.
  function handleSubmit(ev) {
    ev.preventDefault(); // evita o comportamento padrão do <form> (recarregar)
    if (!validar()) return; // tem erro? para aqui e mostra as mensagens
    // Monta o objeto final já com os tipos certos (Number) e as horas calculadas.
    onSubmit({
      data: form.data,
      horaDormir: form.horaDormir,
      horaAcordar: form.horaAcordar,
      horasSono,
      agua: Number(form.agua),
      fezExercicio: form.fezExercicio,
      tipoExercicio: form.fezExercicio ? form.tipoExercicio : "",
      duracaoExercicio: form.fezExercicio ? Number(form.duracaoExercicio) : 0,
      humor: form.humor,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* INPUT CONTROLADO: value vem do estado (form.data) e onChange atualiza o
          estado. Assim o React sempre reflete o valor atual do campo. */}
      <div className="field">
        <label htmlFor="data">Data do registro</label>
        <input
          id="data"
          type="date"
          value={form.data}
          max={hojeISO()} // não deixa escolher data futura
          className={erros.data ? "invalid" : ""} // borda vermelha se houver erro
          onChange={(e) => set("data", e.target.value)}
        />
        {erros.data && <span className="error-text">{erros.data}</span>}
      </div>

      {/* Sono */}
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>
          <span className={`${styles.chip} ${styles.sono}`}><IconMoon width={18} height={18} /></span>
          Sono
        </h3>
        <div className={styles.row}>
          <div className="field">
            <label htmlFor="dormir">Hora de dormir</label>
            <input id="dormir" type="time" value={form.horaDormir}
              className={erros.horaDormir ? "invalid" : ""}
              onChange={(e) => set("horaDormir", e.target.value)} />
            {erros.horaDormir && <span className="error-text">{erros.horaDormir}</span>}
          </div>
          <div className="field">
            <label htmlFor="acordar">Hora de acordar</label>
            <input id="acordar" type="time" value={form.horaAcordar}
              className={erros.horaAcordar ? "invalid" : ""}
              onChange={(e) => set("horaAcordar", e.target.value)} />
            {erros.horaAcordar && <span className="error-text">{erros.horaAcordar}</span>}
          </div>
        </div>
        <p className={styles.computed}>
          Horas de sono: <strong>{horasSono}h</strong>
        </p>
      </section>

      {/* Água */}
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>
          <span className={`${styles.chip} ${styles.agua}`}><IconWater width={18} height={18} /></span>
          Água
        </h3>
        <div className="field">
          <label htmlFor="agua">Quantidade de água (litros)</label>
          <input id="agua" type="number" step="0.1" min="0" value={form.agua}
            className={erros.agua ? "invalid" : ""}
            onChange={(e) => set("agua", e.target.value)} />
          {erros.agua && <span className="error-text">{erros.agua}</span>}
        </div>
      </section>

      {/* Exercício */}
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>
          <span className={`${styles.chip} ${styles.ex}`}><IconRun width={18} height={18} /></span>
          Exercício físico
        </h3>
        <div className="field">
          <label>Praticou exercício hoje?</label>
          <div className={styles.toggle}>
            <button type="button"
              className={form.fezExercicio ? styles.on : ""}
              onClick={() => set("fezExercicio", true)}>Sim</button>
            <button type="button"
              className={!form.fezExercicio ? styles.on : ""}
              onClick={() => set("fezExercicio", false)}>Não</button>
          </div>
        </div>
        {/* RENDERIZAÇÃO CONDICIONAL: os campos de tipo/duração só aparecem
            se a pessoa marcou que fez exercício (form.fezExercicio === true). */}
        {form.fezExercicio && (
          <div className={styles.row}>
            <div className="field">
              <label htmlFor="tipo">Tipo de exercício</label>
              <select id="tipo" value={form.tipoExercicio}
                onChange={(e) => set("tipoExercicio", e.target.value)}>
                <option value="">Selecione...</option>
                {/* .map percorre a lista TIPOS e cria um <option> para cada item.
                    A `key` ajuda o React a identificar cada item da lista. */}
                {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="dur">Duração (min)</label>
              <input id="dur" type="number" min="0" value={form.duracaoExercicio}
                className={erros.duracaoExercicio ? "invalid" : ""}
                onChange={(e) => set("duracaoExercicio", e.target.value)} />
              {erros.duracaoExercicio && <span className="error-text">{erros.duracaoExercicio}</span>}
            </div>
          </div>
        )}
      </section>

      {/* Humor */}
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Como você se sentiu hoje?</h3>
        <div className={styles.humores}>
          {HUMORES.map((h) => (
            <button type="button" key={h} title={LABEL_HUMOR[h]}
              className={`${styles.humor} ${form.humor === h ? styles.humorOn : ""}`}
              onClick={() => set("humor", h)}>
              {EMOJIS_HUMOR[h]}
            </button>
          ))}
        </div>
      </section>

      <button type="submit" className="btn-primary" disabled={enviando}>
        {enviando ? "Salvando..." : textoBotao}
      </button>
    </form>
  );
}
