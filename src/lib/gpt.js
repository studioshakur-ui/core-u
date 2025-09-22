export async function askCore(messages){
  const key = import.meta.env.VITE_OPENAI_KEY
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
  if(!key){
    const last = messages[messages.length-1]?.content || ''
    return { role:'assistant', content:`(demo) Tu as demandé: "${last}"` }
  }
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
    body: JSON.stringify({ model, messages, temperature:0.2 })
  })
  const data = await r.json()
  return data?.choices?.[0]?.message || { role:'assistant', content:'Aucune réponse.' }
}
