import React from "react";
import Header from "../components/Header";
export default function Direzione(){
  const kpis=[
    {label:"Capacité totale (h)", value:"—"},
    {label:"Assignées (h)", value:"—"},
    {label:"Couverture (%)", value:"—"},
    {label:"Δ S vs S-1", value:"—"},
    {label:"Coût estimé (€)", value:"—"},
  ];
  return (<div className="bg-white text-core-text min-h-screen">
    <Header/>
    <main className="container section grid gap-6">
      <h1 className="text-2xl font-semibold">Direction</h1>
      <div className="grid md:grid-cols-3 gap-4">{kpis.map((k,i)=>(<div key={i} className="kpi"><div className="text-sm text-core-muted">{k.label}</div><div className="text-2xl font-semibold">{k.value}</div></div>))}</div>
      <div><button className="btn-primary">Export Exécutif PDF</button></div>
    </main>
  </div>);
}
