# CORE v8.5.1 — Complete (Base funzionale)

**Data build:** 2025-09-21

## Contenuto
- Home WOW + login Supabase (email/password)
- Router React Router (Home/Manager/Capo/Direzione)
- Manager: cards squadre + KPI
- Capo: Rapportino con **Catalogo** e **Export PDF A4**
- Direzione: KPI + Grafico **S vs S-1** (Recharts)
- Tailwind + Netlify SPA redirect
- Seed catalogo `src/data/catalogo_apparato_motore.json`

## Variabili ambiente (Netlify)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Avvio locale
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
```

## Note
Questa versione include base charts e PDF Capo. Le viste avanzate (Delta giornaliero, Burn-up, Heatmap, Pareto, Executive PDF) possono essere aggiunte in un minor update.
