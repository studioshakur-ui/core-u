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
  return (<div className="bg-white text-core-text min-h-screen">
    <Header/>
    <main className="container section grid gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <span className={`badge ${locked?'':'bg-core-surface'}`}>{locked?t.locked:t.unlocked}</span>
      </div>
      <div className="grid md:grid-cols-3 gap-4">{kpis.map((k,i)=>(<div key={i} className="kpi"><div className="text-sm text-core-muted">{k.label}</div><div className="text-2xl font-semibold">{k.value}</div><div className="text-sm text-core-muted">{k.delta}</div></div>))}</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="kpi">
          <div className="font-semibold mb-2">{t.risks}</div>
          <div className="text-sm text-core-muted">Aucun risque (placeholder).</div>
        </div>
        <div className="kpi">
          <div className="font-semibold mb-2">{t.next}</div>
          <ol className="list-decimal pl-5 text-sm text-core-muted"><li>Configurer les seuils KPI.</li><li>Importer le planning.</li><li>Valider la semaine.</li></ol>
        </div>
      </div>
      <div><button className="btn-primary">{t.executiveExport}</button></div>
    </main>
  </div>);
}
