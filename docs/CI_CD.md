# CI/CD — Netlify
1. Crée le site sur Netlify, copie `Site ID`.
2. Dans GitHub → Settings → Secrets → Actions, ajoute :
   - `NETLIFY_AUTH_TOKEN` (token personnel Netlify)
   - `NETLIFY_SITE_ID`
3. Pousse sur `main` → GitHub Actions va build et déployer (voir `.github/workflows/deploy.yml`).

# Build local
```bash
npm install
npm run build
netlify deploy --dir=dist --prod
```
