# FinMind

**AI that actually knows your money.**

FinMind is an AI-powered personal financial decision assistant. It's not an
expense tracker with a chatbot bolted on — it understands a user's full
financial picture (income, expenses, savings, investments, debts, and goals)
and reasons about what they can actually afford, not just what their balance
says.

## Current stage

This repo is being built stage by stage. Right now it's a fully working,
data-driven front end running on mock/local persistence, with the login
screen wired up as the entry point.

```
App
│
├── LoginScreen        ← "Continue with Google" (demo stand-in for now)
│
└── Dashboard          ← shown once "logged in"
    ├── Onboarding      ← first-time setup (voice/text financial input parsing)
    ├── HomeScreen
    ├── ExpensesScreen
    ├── SavingsScreen
    ├── ProfileScreen
    └── ChatPanel + Add sheets (expense / investment / goal / income / budget / emergency fund)
```

- **No data comes pre-filled.** Every screen starts empty and prompts the
  user to add their own income, expenses, investments, and goals — either by
  typing/speaking a free-text description on first login, or manually via
  "Add" buttons throughout the app.
- **The AI chat is data-grounded.** It reads real numbers out of local
  storage and reasons over them (e.g. affordability verdicts weigh cash
  against your emergency fund target and free cash flow) rather than
  returning canned answers. See `src/components/chat/botReplies.js` — this
  file is intentionally isolated because it's what gets replaced by real
  Claude tool calls in Stage 7.
- **Auth is a placeholder shaped like the real thing.** `handleLogin()` in
  `src/App.jsx` currently creates a demo user object shaped exactly like a
  Google OAuth response (`{ id, name, email, avatar }`). Swapping in real
  Google auth (via Supabase) only requires changing that one function.
- **Persistence is a placeholder shaped like the real thing.** `src/lib/storage.js`
  wraps `localStorage` behind the same `get/set/delete` async shape a real
  backend API would have. Swapping in a real database only requires changing
  that one file.

## Project structure

```
src/
  main.jsx              Entry point
  App.jsx                Auth gate: renders LoginScreen or Dashboard
  index.css              Fonts, resets, shared animations
  theme.js                Color palette (Espresso / Terracotta / Copper / Parchment)
  lib/
    finance.js            money/date helpers, category rules, text-parsing, derived calculations
    storage.js            localStorage-backed persistence (swap for a real API later)
  components/
    LoginScreen.jsx
    Onboarding.jsx
    Dashboard.jsx         Tabs, bottom nav, sheet + chat state
    screens/              Home, Expenses, Savings, Profile
    sheets/               Add expense / investment / goal, single-value edits
    chat/
      ChatPanel.jsx
      botReplies.js       All "AI" logic lives here — the Stage 7 replacement target
    ui/                   Shared primitives: Card, Sheet, Gauge, HealthRing, etc.
```

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. On first load you'll land on the login screen;
"Continue with Google" is currently a demo login (see below).

```bash
npm run build     # production build
npm run lint      # oxlint
```

## Roadmap

1. ~~Login UI~~ ✅
2. Real Google authentication (Supabase + Google OAuth — see `.env.example`)
3. Polish first-time setup / onboarding
4. Real database (Supabase Postgres), replacing `src/lib/storage.js`
5. Save expenses/income/goals to the database, scoped per user
6. Load a returning user's data after login
7. Connect FinMind AI to a real backend — Claude tool calls
   (`query_income`, `query_expenses`, `calculate_affordability`,
   `run_what_if_analysis`, etc.) replacing `botReplies.js`
8. Deploy

## Design notes

- **Type**: Fraunces (headlines) + Inter (UI text) + IBM Plex Mono (every
  rupee figure, deliberately — money always renders like a ledger entry).
- **Palette**: Espresso `#2B1B17`, Terracotta `#A04000`, Copper `#CA6F1E`,
  Parchment `#F5E6CC`, plus a derived Moss green for positive signals.
- **Signature element**: the Affordability Gauge in the AI chat — a
  terracotta → copper → moss arc that gives a reasoned verdict
  (Not recommended / Possible with planning / Comfortably affordable)
  instead of a flat yes/no.
