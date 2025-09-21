# CORE v9 — Preview (palette violette + UI minimaliste)

**Changements clés**
- Palette : Violet premium `#6C5CE7`, Gris clair `#F5F5F5`, Blanc, Noir `#121212`.
- Styles globaux ajoutés (variables CSS + utilitaires): `.brand-hero`, `.brand-accent(-bg)`, `.brand-card`, `.brand-bg`.
- Tailwind: couleurs `theme.extend.colors.brand` définies (violet/dark/light/white).
- Home/Accedi: fond adouci et boutons en accent violet (si fichiers détectés).

**Intégration**
- Vérifie que le CSS global est importé (ex: `import './index.css'` ou `import './styles/theme.css'`).
- Utilise les classes utilitaires:
  - `brand-hero` pour la section hero,
  - `brand-card` pour cartes,
  - `brand-accent` / `brand-accent-bg` pour textes/boutons importants,
  - `brand-bg` pour fonds clairs.

**Prochaines étapes (v9 complet)**
- Unifier les tokens (spacing/typescale), passer tous les composants aux utilitaires.
- Direzione: thème graphes cohérent (S vs S-1).
- Manager/Capo: cartes plus sobres, états hover/pressed, focus AA.

_Généré automatiquement le 2025-09-21 21:22._
