export type UUID = string;
export type Role = "capo"|"manager"|"direzione"|"ops"|"admin";

export interface Project { id: UUID; codice: string; nome: string; }

export interface Impianto {
  id: UUID;
  project_id: UUID;
  codice: string;
  nome: string;
}

export interface Activity {
  id: UUID;
  project_id: UUID;
  impianto_id: UUID;
  codice: string;
  titolo_it: string;
}

export interface Team {
  id: string;           // TEXT (chez toi)
  project_id: UUID;
  name: string;
  capo_user_id?: UUID | null;
  week_start: string;   // yyyy-mm-dd
  status: string;       // draft/confirmed/locked
}

export interface TeamMember {
  id?: UUID;
  team_id: string;      // TEXT
  worker_user_id: UUID;
}

export interface TeamImpianto {
  id?: UUID;
  team_id: string;      // TEXT
  impianto_id: UUID;
}

export interface Profile {
  id: UUID;
  nome?: string | null;
  cognome?: string | null;
  telefono?: string | null;
  foto_url?: string | null;
}
