import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { downloadReportinoPDF } from '../lib/pdf'
import { runOCR } from '../lib/ocr'

// --- ENV ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
const AI = import.meta.env.VITE_AI_ENABLED === 'true'
const AI_FN = '/.netlify/functions/ai'

// --- Supabase client (si login utilisé) ---
const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null

// Colonnes métier
const EMPTY_ROW = {
  attivita: '',
  operatori: [],
  operatore: '',
  zona: '',
  previsto: '',
  prodotto: '',
  ore_totali: ''
}

export default function Capo() {
  // état
  const [user, setUser] = useState(null)
  const [rows, setRows] = useState([])
  const [draft, setDraft] = useState({ ...EMPTY_ROW })
  const [summary, setSummary] = useState('')
  const [attachments, setAttachments] = useState([]) // {name,type,blob}
  const [busy, setBusy] = useState(false)
  const [noteOCR, setNoteOCR] = useState('')

  // login léger (optionnel)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
  }, [])

  // helpers
  const addRow = (r) => {
    const normalized = {
      ...EMPTY_ROW,
      ...r,
      operatori: r.operatori && r.operatori.length
        ? r.operatori
        : (r.operatore ? [r.operatore] : [])
    }
    setRows(prev => [...prev, normalized])
    setDraft({ ...EMPTY_ROW })
  }

  const removeRow = (idx) => {
    setRows(prev => prev.filter((_, i) => i !== idx))
  }

  const totalOre = useMemo(
    () => rows.reduce((acc, r) => acc + (Number(r.ore_totali) || 0), 0),
    [rows]
  )

  // --- IA: normaliser ligne à partir d'un texte libre ---
  async function normalizeFromText(text) {
    if (!text?.trim()) return
    setBusy(true)
    try {
      let res
      if (AI) {
        res = await fetch(AI_FN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'normalize',
            payload: { raw: text, catalog: [] }
          })
        })
        const data = await res.json()
        const cleanTitle = data?.clean_title || text.slice(0, 60)
        const row = {
          ...EMPTY_ROW,
          attivita: cleanTitle,
          zona: guessZone(cleanTitle),
          ore_totali: '',
          operatore: '',
          previsto: '',
          prodotto: ''
        }
        setDraft(row)
      } else {
        // fallback si IA off
        setDraft({
          ...EMPTY_ROW,
          attivita: text.slice(0, 60),
          zona: guessZone(text)
        })
      }
    } catch (e) {
      console.error(e)
      setDraft({ ...EMPTY_ROW, attivita: text.slice(0, 60) })
    } finally {
      setBusy(false)
    }
  }

  // --- IA: résumé des lignes ---
  async function makeSummary() {
    if (!AI) { setSummary(''); return }
    setBusy(true)
    try {
      const res = await fetch(AI_FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summarize',
          payload: { rows }
        })
      })
      const data = await res.json()
      setSummary(data?.summary || '')
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  // OCR d’un fichier image/pdf (image préférable)
  async function onUploadOCR(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const text = await runOCR(file)
      setNoteOCR(text || '')
      if (text) {
        await normalizeFromText(text)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  // Attachements visibles dans export PDF
  async function onAttachFiles(e) {
    const files = Array.from(e.target.files || [])
    const mapped = await Promise.all(files.map(async (f) => {
      return { name: f.name, type: f.type, blob: f }
    }))
    setAttachments(prev => [...prev, ...mapped])
    e.target.value = ''
  }

  // Export PDF
  async function exportPDF() {
    const header = {
      titolo: 'Rapportino Giornaliero',
      commessa: '6313',
      data: new Date().toISOString().slice(0, 10),
      capo: user?.email || 'capo',
      org: 'CONIT'
    }
    const rowsForPdf = rows.map(r => ({
      attivita: r.attivita,
      operatori: r.operatori,
      zona: r.zona,
      previsto: r.previsto,
      prodotto: r.prodotto,
      ore_totali: r.ore_totali
    }))
    // on ne met que le nom/type d’attachment dans le PDF (pas d’images incorporées pour rester léger)
    const atts = attachments.map(a => ({ name: a.name, type: a.type }))
    await downloadReportinoPDF({ header, rows: rowsForPdf, attachments: atts, hash: '' })
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">Capo — Rapportino assistito IA</h1>

      {/* Zone OCR & IA */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <label className="block text-sm font-medium mb-2">Importer une photo/pdf pour OCR</label>
          <input type="file" accept="image/*,application/pdf" onChange={onUploadOCR} />
          <p className="text-xs text-slate-500 mt-2">Texte OCR</p>
          <textarea
            className="w-full mt-1 border rounded p-2 h-32"
            value={noteOCR}
            onChange={e => setNoteOCR(e.target.value)}
            placeholder="Texte OCR ou note libre…"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => normalizeFromText(noteOCR)}
              disabled={busy}
              className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              Normaliser
            </button>
            <label className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 cursor-pointer">
              Joindre des fichiers
              <input type="file" className="hidden" multiple onChange={onAttachFiles} />
            </label>
          </div>
        </div>

        {/* Formulaire ligne */}
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm font-medium mb-2">Ajouter la ligne</p>
          <div className="grid grid-cols-2 gap-3">
            <Text label="Attività" value={draft.attivita} onChange={v => setDraft(s => ({ ...s, attivita: v }))} />
            <Text label="Zona" value={draft.zona} onChange={v => setDraft(s => ({ ...s, zona: v }))} />
            <Text label="Previsto" value={draft.previsto} onChange={v => setDraft(s => ({ ...s, previsto: v }))} />
            <Text label="Prodotto" value={draft.prodotto} onChange={v => setDraft(s => ({ ...s, prodotto: v }))} />
            <Text label="Ore totali" value={draft.ore_totali} onChange={v => setDraft(s => ({ ...s, ore_totali: v }))} />
            <Text label="Operatori (CSV)" value={draft.operatori.join(', ')}
              onChange={v => setDraft(s => ({ ...s, operatori: v.split(',').map(x => x.trim()).filter(Boolean) }))} />
          </div>
          <div className="mt-3">
            <button
              onClick={() => addRow(draft)}
              disabled={!draft.attivita}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des lignes */}
      <div className="mt-6 rounded-xl border bg-white">
        <div className="p-3 flex items-center justify-between">
          <p className="font-medium">Righe</p>
          <div className="text-sm text-slate-600">Totale ore: <b>{totalOre.toFixed(2)}</b></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-y">
              <tr>
                <Th>Attività</Th>
                <Th>Operatori</Th>
                <Th>Zona</Th>
                <Th>Prev</Th>
                <Th>Prod</Th>
                <Th>Ore</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan="7" className="text-center p-6 text-slate-500">Aucune ligne</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={i} className="border-b">
                  <Td>{r.attivita}</Td>
                  <Td>{r.operatori?.join(', ')}</Td>
                  <Td>{r.zona}</Td>
                  <Td className="text-right">{r.previsto}</Td>
                  <Td className="text-right">{r.prodotto}</Td>
                  <Td className="text-right">{r.ore_totali}</Td>
                  <Td className="text-right">
                    <button onClick={() => removeRow(i)} className="text-red-600 hover:underline">Suppr.</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé + Export */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Riassunto</p>
            <button
              onClick={makeSummary}
              disabled={busy || rows.length === 0 || !AI}
              className="px-3 py-2 rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Générer (IA)
            </button>
          </div>
          <pre className="text-sm whitespace-pre-wrap">{summary}</pre>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <p className="font-medium mb-2">Export</p>
          <button
            onClick={exportPDF}
            disabled={rows.length === 0}
            className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Esporta PDF
          </button>

          <div className="mt-3">
            <p className="text-sm text-slate-600">Allegati ({attachments.length})</p>
            <ul className="list-disc pl-5 text-sm">
              {attachments.map((a, i) => <li key={i}>{a.name} <span className="text-slate-400">({a.type || 'file'})</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------- Composants UI -------- */
function Text({ label, value, onChange, placeholder = '' }) {
  return (
    <label className="text-sm">
      <div className="text-slate-600 mb-1">{label}</div>
      <input
        className="w-full border rounded px-2 py-2"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}
function Th({ children }) { return <th className="text-left font-medium px-3 py-2 text-slate-600">{children}</th> }
function Td({ children, className = '' }) { return <td className={`px-3 py-2 ${className}`}>{children}</td> }

/* -------- heuristique simple pour trouver une zone dans le texte -------- */
function guessZone(text = '') {
  const z = (text.match(/(zona|pt|ponte)\s*([0-9]+)/i) || [])[2]
  return z ? `PT ${z}` : ''
}
