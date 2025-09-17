import React from "react";

const KPIS = [
  { k: "Capacità coperta", v: "92%",  d: "+4%",  pos:true },
  { k: "Conflitti risolti", v: "38",   d: "-12%", pos:false },
  { k: "Ore registrate",    v: "1.240h", d: "+8%", pos:true },
  { k: "SLAs rispettati",   v: "98%",  d: "+3%",  pos:true },
];

export default function KpiStrip(){
  return (
    <section className="border-y border-white/10 bg-white/5">
      <div className="container-core py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPIS.map((x,i)=>(
          <div key={i} className="card py-4 text-center">
            <div className="text-2xl font-bold">{x.v}</div>
            <div className="text-white/70 text-sm">{x.k}</div>
            <div className={"mt-1 text-xs " + (x.pos ? "text-emerald-400" : "text-rose-400")}>
              {x.pos ? "▲" : "▼"} {x.d}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
