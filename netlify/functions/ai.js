// netlify/functions/ai.js
// Serverless proxy vers OpenAI (clé côté serveur)
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: 'Missing OPENAI_API_KEY' }
  }

  try {
    const { action, payload } = JSON.parse(event.body || '{}')

    if (action === 'normalize') {
      const { raw, catalog = [], prompt } = payload || {}
      const messages = [{ role: 'user', content: prompt || buildNormalizePrompt(raw, catalog) }]
      const data = await openaiChat(apiKey, messages)

      // tente de parser JSON, sinon fallback
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

    return { statusCode: 400, body: 'Unknown action' }
  } catch (e) {
    return { statusCode: 500, body: String(e?.message || e) }
  }
}

// Helpers
async function openaiChat(apiKey, messages, raw = false) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5-thinking',
      temperature: 0.2,
      messages
    })
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${txt}`)
  }
  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content || ''
  return raw ? content : content
}

function buildNormalizePrompt(raw, catalog) {
  const cat = (catalog || []).map(c => `${c.code}:${c.title_it}`).join('; ')
  return `You are a production data normalizer.
Return ONLY valid JSON:
{
  "match_code": "string|null",
  "confidence": 0..1,
  "clean_title": "string",
  "notes": ["string"...]
}
Catalog codes: ${cat}
Text: ${raw || ''}
If uncertain, set match_code:null and confidence<=0.5. No commentary.`
}

function buildSummaryPrompt(rows) {
  const snippet = JSON.stringify(rows || []).slice(0, 4000)
  return `You are a supervisor. Create a 3-bullet Italian summary from these rows:
${snippet}
Rules: max 30 words per bullet, no names, focus on outcomes & blockers.`
}

function ok(obj) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  }
}
