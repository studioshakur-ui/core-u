# CORE v8.2.2

React + Vite + Tailwind + Supabase. Auth email/password (no magic link). RBAC minimal.
Replace files on GitHub, set env on Netlify, deploy.

## Setup
1. Copy all files to your repo.
2. Create env vars on Netlify from `.env.example`.
3. Ensure Supabase `profiles` table exists with `id,email,username,role` and RLS.
4. Deploy.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
