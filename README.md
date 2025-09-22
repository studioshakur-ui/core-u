# CORE v10

Stack: React + Vite + Tailwind, Supabase (Auth + DB), React Router, Chart.js.
Rôles: `capo`, `manager`, `direzione` stockés dans `profiles.role` (text).

## Démarrage
```bash
npm i
cp .env.example .env
# édite .env avec tes clés Supabase + OpenAI
npm run dev
```

## Supabase
- Crée un projet.
- Va dans **Table Editor** et exécute le SQL ci-dessous.

## SQL
Voir `supabase.sql` dans le repo.

## Routes & ACL
- `/` Home WOW (public)
- `/login` Auth
- `/capo` réservé rôle `capo`
- `/manager` réservé rôle `manager`
- `/direzione` réservé rôle `direzione`

## GPT ("Ask CORE")
- Widget en bas à droite (clé OpenAI requise). Si la clé n'est pas fournie, un fallback local renvoie une réponse simulée.
