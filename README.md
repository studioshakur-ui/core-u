# CORE v8.4 — JS/JSX + Tailwind

Pur JavaScript + JSX (pas de TypeScript, pas de CJS).  
Assets dans `/public` (logos + ships).

## Démarrer
```bash
npm install
npm run dev
```

## Build & Netlify
```bash
npm run build
```
Publish: `dist`

### Astuce si Netlify gardait l'ancien `index.html`
Vérifie que la balise script pointe bien vers `/src/main.jsx`.
