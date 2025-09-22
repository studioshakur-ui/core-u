export async function askCore(messages) {
  const key = import.meta.env.VITE_OPENAI_KEY
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

  // Fallback if no key
  if (!key) {
    const last = messages[messages.length - 1]?.content || ''
    return { role: 'assistant', content: `⚠️ Mode démo sans clé OpenAI. Tu as demandé: "${last}". Réponse simulée.` }
  }

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2
    })
  })
  const data = await r.json()
  const content = data?.choices?.[0]?.message?.content || 'Aucune réponse.'
  return { role: 'assistant', content }
}
