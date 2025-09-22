import React, { useMemo } from 'react'
import { useCapoStore } from '../store/store'          // peut rester en .ts, Vite transpile
import { runOCR } from '../lib/ocr'
import { suggest } from '../lib/catalog'

export default function Capo() {
  const {
    rows, draft, attachments, summary, noteOCR, busy, aiEnabled,
    setDraft, addRow, removeRow, clearAll, setNoteOCR, attach,
    normalizeFromText, makeSummary, exportPDF
  } = useCapoStore()

  const totalOre = useMemo(
    () => rows.reduce((a, r) => a + (Number(r.ore_totali) || 0), 0),
    [rows]
  )

  async function onOCR(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await runOCR(file)
    setNoteOCR(text)
    if (text) await normalizeFromText(text)
    e.target.value = ''
  }

  async function onAttach(e) {
    const files = Array.from(e.target.files || [])
    const mapped = files.map(f => ({ name: f.name, type: f.type, blob: f }))
    attach(mapped)
    e.target.value = ''
  }

  const header = {
    titolo: 'Rapportino Giornaliero',
    commessa: '6313',
    data: new Date().toISOString().slice(0, 10),
    capo: 'capo',
    org: 'CONIT'
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Capo — Rapportino</h1>

      {/* OCR + IA */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <label className="block text-sm font-medium mb-2">OCR (image/pdf)</label>
          <input type="file" accept="image/*,application/pdf" onChange={onOCR} />
          <textarea
            className="w-full mt-3 border rounded p-2 h-32"
            value={noteOCR}
            onChange={e => setNoteOCR(e.target.value)}
            placeholder="Texte OCR ou note libre…"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => normalizeFromText(noteOCR)}
              disabled={busy || !noteOCR?.trim()}
              className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Normaliser (IA)
            </button>

            <label className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
              Joindre fichiers
              <input className="hidden" type="file" multiple accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={onAttach}/>
            </label>
          </div>
        </div>

        {/* Form ligne */}
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm font-medium mb-2">Ajouter la ligne</p>
          <div className="grid grid-cols-2 gap-3">
            <Text label="Attività" value={draft.attivita} onChange={v => setDraft({ attivita: v })} />
            <Text label="Zona" value={draft.zona} onChange={v => setDraft({ zona: v })} />
            <Text label="Previsto" value={String(draft.previsto ?? '')} onChange={v => setDraft({ previsto: v })} />
            <Text label="Prodotto" value={String(draft.prodotto ?? '')} onChange={v => setDraft({ prodotto: v })} />
            <Text label="Ore totali" value={String(draft.ore_totali ?? '')} onChange={v => setDraft({ ore_totali: v })} />
            <Text
              label="Operatori (CSV)"
              value={(draft.operatori || []).join(', ')}
              onChange={(v) => setDraft({ operatori: v.split(',').map(x => x.trim()).filter(Boolean) })}
            />
          </div>

          <CatalogSuggest value={draft.attivita} onPick={(it)=>setDraft({ attivita: it.title_it })} />

          <div className="mt-3 flex gap-2">
            <button
              onClick={addRow}
              disabled={!draft.attivita?.trim()}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
            >
              Ajouter
            </button>
            <button
              onClick={clearAll}
              disabled={rows.length===0 && attachments.length===0}
              className="px-3 py-2 rounded border"
            >
              Vider
            </button>
          </div>
        </div>
      </section>

      {/* Tableau */}
      <section className="mt-6 rounded-2xl border bg-white overflow-hidden">
        <div className="p-3 flex items-center justify-between">
          <p className="font-medium">Righe</p>
          <div className="text-sm text-slate-600">Totale ore: <b>{totalOre.toFixed(2)}</b></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-y">
              <tr><Th>Attività</Th><Th>Operatori</Th><Th>Zona</Th><Th>Prev</Th><Th>Prod</Th><Th>Ore</Th><Th/></tr>
            </thead>
            <tbody>
              {rows.length===0 && <tr><td colSpan={7} className="p-6 text-center text-slate-500">Aucune ligne</td></tr>}
              {rows.map((r, i)=>(
                <tr key={i} className="border-b">
                  <Td>{r.attivita}</Td>
                  <Td>{(r.operatori || []).join(', ')}</Td>
                  <Td>{r.zona}</Td>
                  <Td className="text-right">{r.previsto}</Td>
                  <Td className="text-right">{r.prodotto}</Td>
                  <Td className="text-right">{r.ore_totali}</Td>
                  <Td className="text-right">
                    <button onClick={()=>removeRow(i)} className="text-red-600 hover:underline">Suppr.</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Résumé & Export */}
      <section className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Riassunto</p>
            <button
              onClick={makeSummary}
              disabled={!aiEnabled || rows.length===0 || busy}
              className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Générer (IA)
            </button>
          </div>
          <pre className="text-sm whitespace-pre-wrap">{summary}</pre>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <p className="font-medium mb-2">Export</p>
          <button
            onClick={()=>exportPDF(header)}
            disabled={rows.length===0}
            className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Esporta PDF
          </button>
          <p className="text-sm text-slate-600 mt-3">Allegati ({attachments.length})</p>
          <ul className="list-disc pl-5 text-sm">
            {attachments.map((a,i)=><li key={i}>{a.name} <span className="text-slate-400">({a.type||'file'})</span></li>)}
          </ul>
        </div>
      </section>
    </main>
  )
}

/* ===== UI helpers ===== */
function Text({label, value, onChange, placeholder}) {
  return (
    <label className="text-sm">
      <div className="text-slate-600 mb-1">{label}</div>
      <input
        className="w-full border rounded px-2 py-2"
        value={value ?? ''}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}
function Th({children}){ return <th className="text-left font-medium px-3 py-2 text-slate-600">{children}</th>}
function Td({children, className=''}){ return <td className={`px-3 py-2 ${className}`}>{children}</td> }

function CatalogSuggest({ value, onPick }){
  const items = suggest(value)
  if(!value || items.length===0) return null
  return (
    <div className="mt-2 p-2 border rounded bg-slate-50">
      <div className="text-xs text-slate-500 mb-1">Suggestions catalogo</div>
      <div className="flex flex-wrap gap-2">
        {items.map(it=>(
          <button key={it.code} className="px-2 py-1 text-xs rounded border bg-white hover:bg-slate-100" onClick={()=>onPick(it)} title={it.code}>
            {it.title_it}
          </button>
        ))}
      </div>
    </div>
  )
}
