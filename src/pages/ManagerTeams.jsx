import { useEffect, useState } from "react";
import { getSupabase } from "../lib/supabaseClient.js";

export default function ManagerTeams() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const supabase = getSupabase();
    const { data: teams } = await supabase
      .from("teams")
      .select("id,name,week_start,status,capo_user_id")
      .order("week_start",{ascending:false});
    setRows(teams||[]);
    setLoading(false);
  }

  useEffect(()=>{ load(); }, []);

  async function setStatus(id, status) {
    const supabase = getSupabase();
    await supabase.from("teams").update({ status }).eq("id", id);
    load();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Squadre</h1>
      {loading ? "Caricamento…" : rows.map(t=>(
        <div key={t.id} className="border p-3 mb-3">
          <div className="flex justify-between">
            <div>{t.name} · {t.week_start} · {t.status}</div>
            <div className="flex gap-2">
              <button onClick={()=>setStatus(t.id,"confirmed")}>Conferma</button>
              <button onClick={()=>setStatus(t.id,"locked")}>Blocca</button>
              <button onClick={()=>setStatus(t.id,"draft")}>Bozza</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
