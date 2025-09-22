import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { downloadReportinoPDF } from '../lib/pdf'

/* ================== Constantes & utils ================== */

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
  (import.meta?.env?.VITE_AI_ENABLED === 'true') ||
  (typeof process !== 'undefined' && process?.env?.VITE_AI_ENABLED === 'true')

function guessZone(text = '') {
  const m = text.match(/(?:zona|pt|ponte)\s*([0-9]+)/i)
  return m?.[1] ? `PT ${m[1]}` : ''
}

/* ================== Store ================== */

export const useCapoStore = create(
  persist(
    (set, get) => ({
      // state
      rows: [],
      draft: { ...EMPTY_ROW },
      attachments: [],         // [{name,type,blob?}]
      summary: '',
      noteOCR: '',
      busy: false,
      aiEnabled: AI_ENABLED,

      // actions sync
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

      addRow: () =>
        set((s) => {
          if (!s.draft.attivita || !s.draft.attivita.trim()) return s
          const operatori = Array.isArray(s.draft.operatori) ? s.draft.operatori : []
          const newRow = { ...EMPTY_ROW, ...s.draft, operatori }
          return { rows: [...s.rows, newRow], draft: { ...EMPTY_ROW } }
        }),

      removeRow: (index) =>
        set((s) => ({ rows: s.rows.filter((_, i) => i !== index) })),

      clearAll: () => set({ rows: [], summary: '', attachments: [] }),

      setNoteOCR: (txt) => set({ noteOCR: txt }),

      attach: (files) =>
        set((s) => ({ attachments: [...s.attachments, ...files] })),

      // actions async
      normalizeFromText: async (text) => {
        if (!text || !text.trim()) return
        set({ busy: true })
        try {
          // Si IA désactivée : fallback local
          if (!get().aiEnabled) {
            set((s) => ({
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
          const data = await res.json().catch(() => ({}))
          const clean = data?.clean_title || text.slice(0, 60)

          set((s) => ({
            draft: {
              ...s.draft,
              attivita: clean,
              zona: s.draft.zona || guessZone(clean)
            }
          }))
        } catch (e) {
          console.error('[normalizeFromText]', e)
          set((s) => ({
            draft: {
              ...s.draft,
              attivita: text.slice(0, 60),
              zona: s.draft.zona || guessZone(text)
            }
          }))
        } finally {
          set({ busy: false })
        }
      },

      makeSummary: async () => {
        if (!get().aiEnabled || get().rows.length === 0) {
          set({ summary: '' })
          return
        }
        set({ busy: true })
        try {
          const res = await fetch(AI_FN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'summarize',
              payload: { rows: get().rows }
            })
          })
          const data = await res.json().catch(() => ({}))
          set({ summary: data?.summary || '' })
        } catch (e) {
          console.error('[makeSummary]', e)
        } finally {
          set({ busy: false })
        }
      },

      exportPDF: async (header) => {
        const rows = get().rows
        const attachments = get().attachments.map((a) => ({
          name: a.name,
          type: a.type
        }))
        await downloadReportinoPDF({ header, rows, attachments, hash: '' })
      }
    }),
    {
      name: 'core.capo.v1',
      storage: createJSONStorage(() => localStorage),
      // ne pas persister les blobs (trop volumineux)
      partialize: (s) => ({
        rows: s.rows,
        draft: s.draft,
        summary: s.summary,
        noteOCR: s.noteOCR,
        aiEnabled: s.aiEnabled,
        attachments: s.attachments.map((a) => ({ name: a.name, type: a.type }))
      })
    }
  )
)
