import React from 'react'
import ExportPDFButton from '../components/ExportPDFButton'

export default function Manager(){
  const header = { titolo:'Rapportino', commessa:'6313', data: new Date().toISOString().slice(0,10), capo:'Mario R.', org:'Conit' }
  const rows = [
    { attivita:'SALDATURA SUPPORTO LAMPADA', operatori:['CIRO'], zona:'Ponte 5', previsto:2, prodotto:2, ore_totali:3.5 },
    { attivita:'VARI MAGAZZINO', operatori:['MAIGA'], zona:'Magazzino', previsto:4, prodotto:null, ore_totali:2.0 },
  ]
  const attachments = [{ name:'foto1.jpg', type:'photo' }, { name:'checklist.pdf', type:'pdf' }]
  return (
    <div style={{padding:24}}>
      <h2>Manager — Dashboard & Export</h2>
      <ExportPDFButton header={header} rows={rows} attachments={attachments} hash="sha256:DEMOHASH" />
    </div>
  )
}
