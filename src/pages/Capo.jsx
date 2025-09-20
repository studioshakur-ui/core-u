import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import { useAppStore } from "../store/useAppStore";
import { T } from "../i18n";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Capo(){
  const { lang } = useAppStore(); const t=T[lang].capo;
  const [rows,setRows]=useState([{id:1,activity:"",hours:0,note:""}]);
  const total = useMemo(()=> rows.reduce((a,b)=>a+Number(b.hours||0),0),[rows]);
  const addRow = ()=> setRows(prev=>[...prev,{id: (prev.at(-1)?.id||0)+1, activity:"", hours:0, note:""}]);
  const change=(id,key,val)=> setRows(prev=>prev.map(r=>r.id===id?{...r,[key]: key==='hours'?Number(val):val}:r));

  const exportPDF = ()=>{
    const doc = new jsPDF("p","mm","a4");
    doc.setFontSize(14); doc.text("RAPPORTINO", 105, 15, {align:"center"});
    doc.setFontSize(10); doc.text(new Date().toLocaleDateString(), 14, 25);
    autoTable(doc, { startY: 32, head: [[t.activity, t.hours, t.note]], body: rows.map(r=>[r.activity || "-", String(r.hours||0), r.note||""]), styles:{fontSize:10, cellPadding:3}, headStyles:{fillColor:[220,220,220]} });
    doc.text(`${t.total}: ${total}`, 14, doc.lastAutoTable.finalY + 8);
    doc.text("Firma Capo: ____________________", 14, 270);
    doc.text("Firma Direzione: _______________", 120, 270);
    doc.save(`Rapportino_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (<div>
    <Header/>
    <main className="p-6 grid gap-4">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">{t.title}</h1>
          <div className="flex items-center gap-2">
            <button className="btn-primary" onClick={addRow}>{t.add}</button>
            <button className="btn-primary" onClick={exportPDF}>{t.exportPdf}</button>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="opacity-80"><tr><th className="p-2 text-left">{t.activity}</th><th className="p-2 text-left w-28">{t.hours}</th><th className="p-2 text-left">{t.note}</th></tr></thead>
          <tbody>
            {rows.map(r=>(<tr key={r.id} className="border-t border-white/10">
              <td className="p-2"><input className="input" value={r.activity} onChange={e=>change(r.id,'activity',e.target.value)} placeholder={t.activity}/></td>
              <td className="p-2"><input type="number" min="0" max="12" step="0.5" className="input" value={r.hours} onChange={e=>change(r.id,'hours',e.target.value)}/></td>
              <td className="p-2"><input className="input" value={r.note} onChange={e=>change(r.id,'note',e.target.value)} placeholder={t.note}/></td>
            </tr>))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-3">
          <div className="opacity-80">{t.total}: <b>{total}</b></div>
        </div>
      </div>
    </main>
  </div>);
}
