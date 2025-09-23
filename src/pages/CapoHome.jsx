import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CapoHome() {
  const [team, setTeam] = useState(null);
  const [acts, setActs] = useState([]);

  useEffect(()=>{ (async ()=>{
    const { data: t } = await supabase
      .from("teams")
      .select("id,name,week_start,status")
      .eq("status","confirmed")
      .order("week_start",{ascending:false})
      .limit(1)
      .maybeSingle();
    setTeam(t);

    const { data: a } = await supabase
      .from("activities")
      .select("id,codice,titolo_it")
      .limit(50);
    setActs(a||[]);
  })(); },[]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Benvenuto Capo</h1>
      <section className="border p-3">
        <h2 className="font-semibold">Squadra</h2>
        {team ? <div>{team.name} · {team.week_start}</div> : "Nessuna squadra confermata"}
      </section>
      <section className="border p-3">
        <h2 className="font-semibold">Catalogo Attività</h2>
        {acts.map(a=>(
          <div key={a.id}>{a.codice} — {a.titolo_it}</div>
        ))}
      </section>
    </div>
  );
}
