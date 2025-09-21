import React, { useState } from 'react'
import LoginModal from '../components/LoginModal.jsx'

export default function Home(){
  const [open,setOpen]=useState(false)
  return (
    <>
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1567966031749-44d83c99d9b1?q=80&w=2000&auto=format&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 text-white">
          <img src="/logo-core.svg" className="h-10 drop-shadow mb-6" alt="CORE"/>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">CORE — Cable Operations Reporting & Engineering</h1>
          <p className="mt-4 text-lg text-white/80 max-w-3xl">Pianifica squadre, compila i rapportini e visualizza i KPI in modo rapido e preciso.</p>
          <div className="mt-8 flex gap-3">
            <button onClick={()=>setOpen(true)} className="brand-accent-bg">Accedi</button>
            <a href="#features" className="btn-ghost">Scopri le funzionalità</a>
          </div>
        </div>
      </section>
      <section id="features" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
        {[
          {t:'Manager',d:'Gestione Squadre, import da Excel, nuvola operai liberi con drag & drop.'},
          {t:'Capo Squadra',d:'Rapportino giornaliero con catalogo attività pre-caricato. PDF identico al cartaceo.'},
          {t:'Direzione',d:'KPI settimanali, confronto S vs S-1, previsioni e anomalie prioritarie.'},
        ].map(i=>(<div key={i.t} className="card p-6"><div className="text-sm uppercase tracking-wide text-core-petrol">{i.t}</div><div className="text-xl font-bold mt-1">{i.t==='Capo Squadra'?'Rapportino':i.t}</div><p className="text-gray-600 mt-2">{i.d}</p></div>))}
      </section>
      <LoginModal open={open} onClose={()=>setOpen(false)}/>
    </>
  )
}
