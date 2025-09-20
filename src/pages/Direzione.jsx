import React from "react";
import Header from "../components/Header";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";

export default function Direzione(){
  const { lang } = useAppStore(); const t=T[lang].direzione;
  const locked=false;
  const kpis=[
    {label:"Capacità totale (h)", value:"—", delta:"—"},
    {label:"Assegnati (h)", value:"—", delta:"—"},
    {label:"Copertura (%)", value:"—", delta:"—"},
    {label:"Heures validate", value:"—", delta:"—"},
    {label:"Δ S vs S-1", value:"—", delta:"—"},
    {label:"Coût estimé (€)", value:"—", delta:"—"},
  ];
  return (<div>
    <Header/>
    <main className="p-6 grid gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <span className={`badge ${locked?'bg-green-500/20 border-green-500/40':'bg-yellow-500/20 border-yellow-500/40'}`}>{locked?t.locked:t.unlocked}</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">{kpis.map((k,i)=>(<div key={i} className="kpi"><div className="text-sm opacity-80">{k.label}</div><div className="text-2xl font-semibold">{k.value}</div><div className="text-sm opacity-70">{k.delta}</div></div>))}</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-semibold mb-2">{t.risks}</div>
          <div className="text-sm opacity-80">Aucun risque (placeholder).</div>
        </div>
        <div className="card p-4">
          <div className="font-semibold mb-2">{t.next}</div>
          <ol className="list-decimal pl-5 text-sm opacity-90"><li>Configurer les seuils KPI.</li><li>Importer le planning.</li><li>Valider la semaine.</li></ol>
        </div>
      </div>
      <div><button className="btn-primary">{t.executiveExport}</button></div>
    </main>
  </div>);
}
