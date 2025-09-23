import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient.js";
import { parseExcel } from "../lib/xlsx.js";

function toMondayISO(dateOrISO) {
  const base = dateOrISO ? new Date(dateOrISO) : new Date();
  const day = base.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  const d = new Date(base);
  d.setHours(0,0,0,0);
  d.setDate(base.getDate() + delta);
  return d.toISOString().slice(0,10);
}

export default function ManagerImport() {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [busy, setBusy] = useState(false);

  const log = (s) => setLogs(L => [s, ...L]);

  async function handleImport() {
    if (!file) return;
    setBusy(true); setLogs([]);
    const supabase = getSupabase();

    try {
      const rows = await parseExcel(file);
      if (!rows.length) { log("Nessuna riga valida nel file."); setBusy(false); return; }

      // Progetti
      const projCodes = Array.from(new Set(rows.map(r => r.progetto).filter(Boolean)));
      const projIdByCode = new Map();
      for (const codice of projCodes) {
        const { data, error } = await supabase
          .from("projects")
          .upsert({ codice, nome: codice }, { onConflict: "codice" })
          .select("id,codice").single();
        if (error) throw error;
        projIdByCode.set(codice, data.id);
        log(`Progetto OK: ${codice} → ${data.id}`);
      }

      // Impianti
      const impKey = (p, i) => `${p}::${i}`;
      const impIds = new Map();
      const impKeys = Array.from(new Set(rows
        .filter(r => r.progetto && r.impianto)
        .map(r => impKey(r.progetto, r.impianto))));
      for (const key of impKeys) {
        const [pc, ic] = key.split("::");
        const project_id = projIdByCode.get(pc);
        const { data, error } = await supabase
          .from("impianti")
          .upsert({ project_id, codice: ic, nome: ic }, { onConflict: "project_id,codice" })
          .select("id").single();
        if (error) throw error;
        impIds.set(key, data.id);
        log(`Impianto OK: ${ic} (proj ${pc})`);
      }

      // Prépare upserts
      const teamUpserts = [];
      const teamImpiantiUpserts = [];
      const teamMembersUpserts = [];
      const projectMembersUpserts = [];
      const capoPerTeam = {};

      for (const r of rows) {
        const teamId = (r.team || "").trim();
        if (!teamId) continue;

        const projCode = (r.progetto || projCodes[0]);
        const project_id = projIdByCode.get(projCode);
        const week_start = toMondayISO(r.settimana);
        const status = "confirmed";

        teamUpserts.push({ id: teamId, project_id, name: teamId, week_start, status });

        if (r.impianto) {
          const key = impKey(projCode, r.impianto);
          const impianto_id = impIds.get(key);
          if (impianto_id) teamImpiantiUpserts.push({ team_id: teamId, impianto_id });
        }

        const user_id = (r.user_id || "").trim();
        const ruoloL = (r.ruolo || "").toLowerCase();
        const isCapo = r.isCapoVerde || ruoloL === "capo";

        if (user_id) {
          teamMembersUpserts.push({ team_id: teamId, worker_user_id: user_id });
          projectMembersUpserts.push({ user_id, project_id, ruolo: isCapo ? "capo" : "ops" });
          if (isCapo && !capoPerTeam[teamId]) capoPerTeam[teamId] = user_id;
        }
      }

      // Upserts
      if (teamUpserts.length) {
        const seen = new Set();
        const dedup = teamUpserts.filter(t => (seen.has(t.id) ? false : (seen.add(t.id), true)));
        const { error } = await supabase.from("teams").upsert(dedup, { onConflict: "id" });
        if (error) throw error;
        log(`Squadre create/aggiornate: ${dedup.length}`);
      }

      const capoUpdates = Object.entries(capoPerTeam).map(([id, capo_user_id]) => ({ id, capo_user_id }));
      for (const u of capoUpdates) {
        const { error } = await supabase.from("teams").update({ capo_user_id: u.capo_user_id }).eq("id", u.id);
        if (error) throw error;
      }
      if (capoUpdates.length) log(`Capo assegnato su ${capoUpdates.length} team`);

      if (teamImpiantiUpserts.length) {
        const key = (x)=> `${x.team_id}::${x.impianto_id}`;
        const seen = new Set();
        const dedup = teamImpiantiUpserts.filter(x => (seen.has(key(x))? false : (seen.add(key(x)), true)));
        for (const rec of dedup) {
          const { error } = await supabase.from("team_impianti").upsert(rec, { onConflict: "team_id,impianto_id" });
          if (error) throw error;
        }
        log(`Team collegati agli impianti: ${dedup.length}`);
      }

      if (teamMembersUpserts.length) {
        const key = (x)=> `${x.team_id}::${x.worker_user_id}`;
        const seen = new Set();
        const dedup = teamMembersUpserts.filter(x => (seen.has(key(x))? false : (seen.add(key(x)), true)));
        for (const rec of dedup) {
          const { error } = await supabase.from("team_members").upsert(rec, { onConflict: "team_id,worker_user_id" });
          if (error) throw error;
        }
        log(`Membri assegnati: ${dedup.length}`);
      }

      if (projectMembersUpserts.length) {
        const key = (x)=> `${x.user_id}::${x.project_id}`;
        const seen = new Set();
        const dedup = projectMembersUpserts.filter(x => (seen.has(key(x))? false : (seen.add(key(x)), true)));
        for (const rec of dedup) {
          const { error } = await supabase.from("project_members").upsert(rec, { onConflict: "user_id,project_id" });
          if (error) throw error;
        }
        log(`Ruoli progetto aggiornati: ${dedup.length}`);
      }

      log("✅ Import completato.");
    } catch (e) {
      console.error(e);
      log(`❌ Errore: ${e.message || e.toString()}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Import Excel — Manager</h1>
      <input type="file" accept=".xlsx,.xls" onChange={(e)=>setFile(e.target.files?.[0]??null)} />
      <button
        onClick={handleImport}
        disabled={!file || busy}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? "Import in corso..." : "Importa"}
      </button>
      <div className="bg-gray-50 border rounded p-3 text-sm h-64 overflow-auto">
        {logs.map((l,i)=><div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
