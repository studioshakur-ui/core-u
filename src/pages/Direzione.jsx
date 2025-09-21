import React from 'react'
import KPI from '../components/KPI.jsx'
import WeeklyProductionChart from '../components/WeeklyProductionChart.jsx'

export default function Direzione(){
  const data = [
    {day:'Lun', S: 90, S1: 100},
    {day:'Mar', S: 110, S1: 105},
    {day:'Mer', S: 130, S1: 120},
    {day:'Gio', S: 160, S1: 140},
    {day:'Ven', S: 150, S1: 145},
    {day:'Sab', S: 170, S1: 150},
    {day:'Dom', S: 180, S1: 160},
  ]
  const sum = a => a.reduce((n,x)=>n+x,0)
  const delta = Math.round(((sum(data.map(d=>d.S)) - sum(data.map(d=>d.S1))) / sum(data.map(d=>d.S1))) * 1000)/10
  return (
    <section className="p-6">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Direzione — Quadro sintetico</h2>
        <p className="text-gray-600">Produzione settimanale (S vs S-1). Delta: <span className={delta>=0?'text-green-600':'text-red-600'}>{delta}%</span></p>
      </header>
      <div className="grid md:grid-cols-3 gap-4">
        <KPI label="Copertura operatori" value="92%" delta={+3.2}/>
        <KPI label="Ore complessive (S)" value="732 h" delta={+1.4}/>
        <KPI label="Costo stimato (S)" value="€ 128.4k" delta={-0.9}/>
      </div>
      <div className="mt-4">
        <WeeklyProductionChart data={data}/>
      </div>
    </section>
  )
}
