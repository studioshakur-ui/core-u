// src/lib/ai.js
import { z } from 'zod'
import { PROMPTS } from '../ai/prompts'

const AI_ENABLED = (import.meta.env.VITE_AI_ENABLED === 'true')

const schemaNormalize = z.object({
  match_code: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  clean_title: z.string(),
  notes: z.array(z.string()).optional().default([])
})

const FN_URL = '/.netlify/functions/ai'

export async function normalizeActivity(raw, catalog = []) {
  if (!AI_ENABLED) {
    return { match_code: null, confidence: 0, clean_title: (raw || '').slice(0, 60), notes: ['ai_disabled'] }
  }
  const prompt = PROMPTS.normalizeActivity({ raw, catalog })
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'normalize', payload: { raw, catalog, prompt } })
  })
  const data = await res.json()
  const parsed = schemaNormalize.safeParse(data)
  if (!parsed.success) {
    return { match_code: null, confidence: 0, clean_title: (raw || '').slice(0, 60), notes: ['schema_invalid'] }
  }
  return parsed.data
}

export async function summarizeReport(rows = []) {
  if (!AI_ENABLED) return ''
  const prompt = PROMPTS.summarizeReport({ rows })
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'summarize', payload: { rows, prompt } })
  })
  const data = await res.json()
  return data?.summary || ''
}
