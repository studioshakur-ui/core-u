import React, { useState } from 'react'
import { ocrImage } from '../lib/ocr'
import { normalizeActivity, summarizeReport } from '../lib/ai'
import AIConfidenceBadge from '../components/ui/AIConfidenceBadge'

export default function Capo(){
  const [raw, setRaw] = useState('')
  const [norm, setNorm] = useState(null)
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState('')

  async function handleOCR(e){
    const file = e.target.files?.[0]
    if(!file) return
    const text = await ocrImage(file)
    setRaw(text)
  }

  async function handleNormalize(){
    const catalog = [{ code:'MAG-VARI', title_it:'VARI MAGAZZINO' }, { code:'ILL-SUPP-LAMP', title_it:'SALDATURA SUPPORTO LAMPADA' }]
    const n = await normalizeActivity(raw.slice(0,400))
    setNorm(n)
  }

  async function handleAddRow(){
    if(!norm){ return }
    setRows(prev => [...prev, { attivita: norm.clean_title, code: norm.match_code, ore_totali: 1 }])
    const s = await summarizeReport(rows)
    setSummary(s)
  }

  return (
    <div style={{padding:24}}>
      <h2>Capo — Rapportino assistito IA</h2>
      <div style={{display:'grid', gap:12, maxWidth:640}}>
        <input type="file" accept="image/*,application/pdf" onChange={handleOCR} />
        <textarea rows={6} value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Testo OCR o nota..." />
        <div style={{display:'flex', gap:8}}>
          <button onClick={handleNormalize}>Normaliser</button>
          <button onClick={handleAddRow} disabled={!norm}>Ajouter la ligne</button>
        </div>
        {norm && <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div>Attività: <strong>{norm.clean_title}</strong> {norm.match_code && <em>({norm.match_code})</em>}</div>
          <AIConfidenceBadge value={norm.confidence} />
        </div>}
        <div>
          <h4>Righe</h4>
          <pre>{JSON.stringify(rows, null, 2)}</pre>
        </div>
        <div>
          <h4>Riassunto</h4>
          <pre>{summary}</pre>
        </div>
      </div>
    </div>
  )
}
