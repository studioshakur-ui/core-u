import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Capo(){
  const [rows,setRows]=useState([{id:1,operaio:"",activity:"",hours:0,note:""}]);
  const total = useMemo(()=> rows.reduce((a,b)=>a+Number(b.hours||0),0),[rows]);
  const add = ()=> setRows(p=>[...p,{id:(p.at(-1)?.id||0)+1, operaio:"", activity:"", hours:0, note:""}]);
  const ch=(id,k,v)=> setRows(p=>p.map(r=>r.id===id?{...r,[k]:k==='hours'?Number(v):v}:r));
  const exportPDF=()=>{
    const doc=new jsPDF("p","mm","a4"); doc.setFontSize(14); doc.text("RAPPORTINO",105,15,{align:"center"});
    autoTable(doc,{startY:22, head:[["Operaio","Attività","Ore","Note"]], body: rows.map(r=>[r.operaio||"-",r.activity||"-",String(r.hours||0),r.note||""]), headStyles:{fillColor:[230,232,235]}});
    doc.text("Totale ore: "+total, 14, doc.lastAutoTable.finalY+8); doc.save("rapportino.pdf");
  };
  return (<div className="bg-white text-core-text min-h-screen">
    <Header/>
    <main className="container section grid gap-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Capo — Oggi</h1><div className="flex gap-2"><button className="btn-outline" onClick={add}>Ajouter</button><button className="btn-primary" onClick={exportPDF}>Exporter PDF</button></div></div>
      <div className="card p-4">
        <table className="table">
          <thead><tr><th>Operaio</th><th>Attività</th><th>Ore</th><th>Note</th></tr></thead>
        <tbody>{rows.map(r=>(<tr key={r.id}><td><input className="input" value={r.operaio} onChange={e=>ch(r.id,'operaio',e.target.value)}/></td><td><input className="input" value={r.activity} onChange={e=>ch(r.id,'activity',e.target.value)}/></td><td><input type="number" min="0" max="12" step="0.5" className="input" value={r.hours} onChange={e=>ch(r.id,'hours',e.target.value)}/></td><td><input className="input" value={r.note} onChange={e=>ch(r.id,'note',e.target.value)}/></td></tr>))}</tbody>
        </table>
        <div className="mt-3">Totale: <b>{total}</b> ore</div>
      </div>
    </main>
  </div>);
}
