// netlify/functions/ai.js
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function handler(event) {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' }
  }

  // Healthcheck GET
  if (event.httpMethod === 'GET') {
    return { statusCode: 200, headers: CORS, body: 'OK: /ai is up' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { statusCode: 500, headers: CORS, body: 'Missing OPENAI_API_KEY' }
  }

  try {
    const { action, payload } = JSON.parse(event.body || '{}')

    if (action === 'normalize') {
      const { raw, catalog = [], prompt } = payload || {}
      const messages = [{ role: 'user', content: prompt || buildNormalizePrompt(raw, catalog) }]
      const data = await openaiChat(apiKey, messages)

      let out = { match_code: null, confidence: 0, clean_title: (raw || '').slice(0, 60), notes: ['parse_fallback'] }
      try { out = JSON.parse(data) } catch {}
      return ok(out)
    }

    if (action === 'summarize') {
      const { rows = [], prompt } = payload || {}
      const messages = [{ role: 'user', content: prompt || buildSummaryPrompt(rows) }]
      const text = await openaiChat(apiKey, messages, /*raw*/true)
      return ok({ summary: text })
    }

    return { statusCode: 400, headers: CORS, body: 'Unknown action' }
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: String(e?.message || e) }
  }
}

function ok(obj) {
  return { statusCode: 200, headers: CORS, body: JSON.stringify(obj) }
}

async function openaiChat(apiKey, messages, raw=false) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-thinking', temperature: 0.2, messages })
  })
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content || ''
  return raw ? content : content
}

function buildNormalizePrompt(raw, catalog) {
  const cat = (catalog || []).map(c => `${c.code}:${c.title_it}`).join('; ')
  return `Return ONLY JSON:
{"match_code": "string|null","confidence": 0..1,"clean_title": "string","notes": ["string"...]}
Catalog: ${cat}
Text: ${raw || ''}`
}

function buildSummaryPrompt(rows) {
  const snippet = JSON.stringify(rows || []).slice(0, 4000)
  return `Make 3 concise Italian bullets (<=30 words each) summarizing: ${snippet}`
}
