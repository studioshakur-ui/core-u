# CORE v6 (Full)
Design LV (gris damier), i18n IT/FR/EN, Capo rapportino PDF, Manager import wizard (CSV/XLSX + paste), Direzione dashboard (squelette), pas de données codées.

## Démarrer
```
npm i
npm run dev
```
Configurez Netlify (ou local) avec:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Remplacer l'image hero
Placez votre photo 1920px en `public/assets/ships/core-hero.jpg`.

## Capo
- Saisie activité/heure/note
- Export PDF rapportino (jspdf + autotable)
- Aucun mock

## Manager
- Import CSV/XLSX ou coller depuis Excel
- Mapping, Dry-run (erreurs + export CSV)
- (Prêt pour) DnD planning et export XLSX/PDF visuels (Capo vert / Operai blanc)

## Direzione
- KPI placeholders, risques, next actions
- Export exécutif (à compléter)
