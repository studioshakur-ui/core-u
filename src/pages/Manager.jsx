import React from 'react'
import KPI from '../components/KPI.jsx'

export default function Manager(){
  return (
    <section className="p-6">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Squadre</h2>
        <p className="text-gray-600">Crea, valida e gestisci le tue squadre con operai e capi.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Capo Squadra</div>
                <div className="font-semibold">Maiga Hamidou</div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Attiva</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Cigan','Khan','Miah','Hossain','Sonko'].map(n => (
                <span key={n} className="px-2 py-1 bg-gray-100 rounded-lg text-sm">{n}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-ghost">Modifica</button>
              <button className="btn-primary">Valida</button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <KPI label="Squadre attive" value="8/10" delta={+3.2} />
        <KPI label="Operatori assegnati" value="85/100" delta={+1.4} />
        <KPI label="Ore pianificate (oggi)" value="732 h" delta={-0.9} />
      </div>
    </section>
  )
}
