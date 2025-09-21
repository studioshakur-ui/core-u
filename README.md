# CORE v9.1

Version prête à pousser sur GitHub, intégrant :

- Design System homogène (palette violet/gris, échelle typographique, radius/ombres)
- Catalogo productif (recherche fuzzy, suggestions, favoris)
- Dashboard Direzione premium (KPIs Δ vs S-1, panneau risques, export executive)
- Export PDF métier (totaux, signatures, QR code)
- Base SQL Supabase v9 (RLS Capo/Manager/Direzione)

## Démarrage
```bash
npm install
npm run dev
```

## CI/CD
- GitHub Actions → Netlify (`.github/workflows/deploy.yml`)

## Export PDF
- `src/lib/pdf.js` + `<ExportPDFButton />`
