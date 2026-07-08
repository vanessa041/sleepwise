# 🌙 SleepWise — Sistema Inteligente de Monitoramento do Sono e Bem-Estar

> Entenda seus hábitos, melhore seu sono.

Aplicação web em **React** que permite registrar hábitos diários (sono, água e
exercícios), calcula automaticamente a **qualidade do sono** e uma **estimativa de
estresse**, e apresenta tudo em um **dashboard com gráficos** e recomendações
personalizadas.

Projeto da disciplina **Desenvolvimento Web Frontend** — UFRN / Bacharelado em
Ciências e Tecnologia.

---

## ✨ Funcionalidades

- **Autenticação** (login e cadastro) com sessão persistida em `localStorage`
- **Registro diário**: horário de dormir/acordar (horas de sono calculadas
  automaticamente), consumo de água, exercícios (tipo e duração) e humor
- **Cálculo da qualidade do sono**: boa · moderada · ruim
- **Estimativa do nível de estresse** (0–100)
- **Dashboard** com cards de resumo e gráficos (barras, rosca e medidor)
- **Relatórios**: histórico completo com visualização, **edição** e **exclusão**
- **Rotas protegidas**, página **404** e layout responsivo com navegação inferior

### Regras de negócio

| Qualidade do sono | Horas dormidas |
| ----------------- | -------------- |
| Boa               | ≥ 8h           |
| Moderada          | 6h a 7h        |
| Ruim              | < 6h           |

Estimativa de estresse (base 20, limitada a 100):

```js
let stress = 20;
if (horasSono < 6) stress += 40;
if (agua < 2)      stress += 20;
if (!exercicio)    stress += 20;
```

> ⚠️ O sistema tem **caráter informativo/educativo** e não substitui avaliação médica.

---

## 🛠️ Stack técnica

| Camada        | Tecnologia                                        |
| ------------- | ------------------------------------------------- |
| UI            | React 19 + Vite                                   |
| Rotas         | React Router                                      |
| Estado global | Context API (autenticação)                        |
| Estilo        | CSS Modules + variáveis CSS (tema escuro)         |
| Gráficos      | Recharts                                          |
| HTTP          | Axios                                             |
| Backend REST  | JSON Server (API fake com CRUD completo)          |

### Conceitos atendidos (Capítulo 12 — Integração Frontend/Backend)

- ✅ Gerenciamento de **estados de carregamento** (`Loader`, `useRegistros`)
- ✅ **Tratamento de erros** em requisições (`mensagemErro`, `ErrorMessage`, retry)
- ✅ **JSON Server** como backend REST
- ✅ Operações **CRUD** completas sobre `registros`
- ✅ **Integração** React ↔ backend REST (camada `services/` + `api/client.js`)

---

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js 18+**.

```bash
# 1. Instalar dependências
npm install

# 2a. Subir tudo de uma vez (backend + frontend)
npm start

# 2b. …ou em dois terminais separados:
npm run server   # JSON Server em http://localhost:3001
npm run dev      # App em http://localhost:5173
```

Abra **http://localhost:5173**.

### Conta de teste

- **E-mail:** `ana@email.com`
- **Senha:** `123456`

(ou crie uma conta nova pela tela de cadastro)

---

## 📁 Estrutura do projeto

```
src/
├── api/            # cliente Axios + normalização de erros
├── components/     # UI reutilizável (Loader, ErrorMessage, formulário, ícones…)
├── context/        # Context API de autenticação
├── hooks/          # useRegistros (loading/erro/retry)
├── pages/          # telas (Home, Login, Cadastro, Dashboard, Registro, Relatórios…)
├── services/       # chamadas REST (authService, registrosService)
└── utils/          # regras de negócio (métricas) e formatação
db.json             # base de dados do JSON Server
```

### Rotas

| Rota              | Acesso    | Descrição                          |
| ----------------- | --------- | ---------------------------------- |
| `/`               | Público   | Página inicial                     |
| `/login`          | Público   | Login                              |
| `/cadastro`       | Público   | Cadastro                           |
| `/dashboard`      | Protegido | Gráficos e métricas                |
| `/registro`       | Protegido | Registro diário (create)           |
| `/relatorios`     | Protegido | Histórico de registros (read)      |
| `/relatorio/:id`  | Protegido | Detalhe / editar / excluir         |
| `/perfil`         | Protegido | Dados do usuário e metas           |
| `*`               | —         | Página 404                         |

---

## ☁️ Deploy (aplicação hospedada)

O **frontend** pode ser publicado na **Vercel**, **Netlify** ou **GitHub Pages**.
Como o **JSON Server** precisa de um servidor Node, ele deve ser hospedado à parte
(ex.: **Render** ou **Railway**) e a URL configurada na variável de ambiente:

```
VITE_API_URL=https://sua-api.onrender.com
```

Veja `.env.example`. Sem essa variável, o app usa `http://localhost:3001`.

> Para a gravação do vídeo de apresentação, a forma mais simples é rodar
> `npm start` localmente (backend + frontend juntos).

---

## 🤖 Declaração do uso de Inteligência Artificial

A Inteligência Artificial foi utilizada como ferramenta de apoio na **organização e
estruturação do projeto**, auxiliando na escrita de código, refinamento das
funcionalidades, definição do sitemap e sugestões de layout. A **definição do tema,
das ideias centrais e das funcionalidades** foi realizada pela autora, que participou
ativamente da revisão, adaptação e validação de todas as sugestões geradas.

**Ferramenta utilizada:** Claude (Anthropic).

---

## 👩‍💻 Autoria

**Vanessa Freitas de Sousa** — Matrícula 20220008630 — Turma T01
UFRN · Natal/RN · 2026
