import React from 'react'

function KPI({ label, value, delta }) {
  const trend = delta > 0 ? '▲' : delta < 0 ? '▼' : '•'
  const clr = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : '#6b7280'
  return (
    <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
      <div style={{fontSize:12,color:'#6b7280'}}>{label}</div>
      <div style={{display:'flex',alignItems:'baseline',gap:8}}>
        <div style={{fontSize:28,fontWeight:700,color:'#111827'}}>{value}</div>
        <div style={{fontSize:12,fontWeight:600,color:clr}}>{trend} {Math.abs(delta)}%</div>
      </div>
    </div>
  )
}

export default function Direzione() {
  return (
    <section style={{padding:24}}>
      <header style={{marginBottom:16}}>
        <h2 style={{margin:0,fontSize:24,fontWeight:700,color:'#0f172a'}}>Direzione — Quadro sintetico</h2>
        <p style={{margin:'6px 0 0',color:'#6b7280'}}>Settimana attuale · confronto S vs S-1</p>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3, minmax(0,1fr))',gap:16}}>
        <KPI label="Copertura operatori" value="92%" delta={+3.2} />
        <KPI label="Ore complessive (S)" value="732 h" delta={+1.4} />
        <KPI label="Costo stimato (S)" value="€ 128.4k" delta={-0.9} />
      </div>

      <div style={{marginTop:16,display:'grid',gridTemplateColumns:'1.8fr 1fr',gap:16}}>
        <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
          <div style={{fontWeight:700,marginBottom:8}}>Trend settimanale (ore)</div>
          <div style={{height:220,display:'grid',placeItems:'center',color:'#6b7280'}}>
            {/* Qui in seguito un grafico reale (es. Recharts). */}
            <span>Grafico placeholder — S vs S-1</span>
          </div>
        </div>

        <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
          <div style={{fontWeight:700,marginBottom:8}}>Rischi & anomalie</div>
          <ul style={{margin:0,paddingLeft:18,color:'#6b7280',lineHeight:1.6}}>
            <li>{'> 12h/giorno'} su 4 operatori (warning)</li>
            <li>Doppia assegnazione: 1 caso (da risolvere)</li>
            <li>Rapportini non validati: 3 squadre</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
