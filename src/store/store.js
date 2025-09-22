import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { downloadReportinoPDF } from '../lib/pdf'

/* ====== Constantes ====== */
const EMPTY_ROW = {
  attivita: '',
  operatori: [],
  zona: '',
  previsto: '',
  prodotto: '',
  ore_totali: ''
}

const AI_FN = '/.netlify/functions/ai'
const AI_ENABLED =
  import.meta?.env?.VITE_AI_ENABLED === 'true' ||
  (typeof process !== 'undefined' && process.env?.VITE_AI_ENABLED === 'true')

function guessZone(text = '') {
  const m = text.match(/(?:zona|pt|ponte)\\s*([0-9]+)/i)
  return m?.[1] ? `PT ${m[1]}` : ''
}

/* ====== Store ====== */
export const useCapoStore = create(
  persist(
    (set, get) => ({
      rows: [],
      draft: { ...EMPTY_ROW },
      attachments: [],   // {name,type,blob?}
      summary: '',
      noteOCR: '',
      busy: false,
      aiEnabled: AI_ENABLED,

      /* === sync === */
      setDraft: (patch) => set(s => ({ draft: { ...s.draft, ...patch } })),
      addRow: () => set(s => {
        if (!s.draft.attivita?.trim()) return s
        const operatori = s.draft.operatori?.length ? s.draft.operatori : []
        const newRow = { ...EMPTY_ROW, ...s.draft, operatori }
        return { rows: [...s.rows, newRow], draft: { ...EMPTY_ROW } }
      }),
      removeRow: (index) => set(s => ({ rows: s.rows.filter((_, i) => i !== index) })),
      clearAll: () => set({ rows: [], summary: '', attachments: [] }),
      setNoteOCR: (txt) => set({ noteOCR: txt }),
      attach: (files) => set(s => ({ attachments: [...s.attachments, ...files] })),

      /* === async === */
      normalizeFromText: async (text) => {
        if (!text?.trim()) return
        set({ busy: true })
        try {
          if (!get().aiEnabled) {
            set(s => ({
              draft: {
                ...s.draft,
                attivita: text.slice(0, 60),
                zona: s.draft.zona || guessZone(text)
              }
            }))
            return
          }

          const res = await fetch(AI_FN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'normalize',
              payload: { raw: text, catalog: [] }
            })
          })
          const data = await res.json()
          const clean = data?.clean_title || text.slice(0, 60)
