# CORE v8.1 (IT) — Manager
Italiano only. Design premium, DnD, creazione senza import.

## Setup
1. Node 18+
2. `cp .env.example .env` e compilare `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. `npm i`
4. `npm run dev`

## Supabase
- Tabelle: `teams (id TEXT)`, `people`, `team_people`
- RPC consigliate: `fn_team_create`, `fn_person_upsert`, `fn_team_add_person`, `fn_person_set_role`
- Il codice usa fallback INSERT/UPSERT se le RPC non esistono (con RLS permissive).
