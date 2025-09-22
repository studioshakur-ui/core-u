import { useState } from 'react'
import { askCore } from '../lib/gpt.js'

export default function ChatGPT() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Tu es Ask CORE: aide Capo, Manager, Direzione.' }
  ])
  const [input, setInput] = useState('')

  async function send() {
    if (!input.trim()) return
    const next = [...messages, { role: 'user', content: input }]
    setMessages(next)
    setInput('')
    const res = await askCore(next)
    setMessages(prev => [...prev, res])
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="w-[320px] h-[420px] rounded-2xl shadow-hard bg-core-card flex flex-col overflow-hidden mb-3">
          <div className="px-3 py-2 border-b border-white/10 text-sm">Ask CORE</div>
          <div className="flex-1 p-3 space-y-2 overflow-auto">
            {messages.filter(m=>m.role!=='system').map((m, i) => (
              <div key={i} className={m.role==='user' ? 'text-right' : ''}>
                <div className={"inline-block rounded-lg px-3 py-2 text-sm " + (m.role==='user' ? 'bg-core-violet' : 'bg-white/10')}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Pose ta question…"
              className="flex-1 bg-black/30 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button onClick={send} className="rounded-lg bg-core-violet px-3 text-sm">Envoyer</button>
          </div>
        </div>
      )}
      <button
        onClick={()=>setOpen(v=>!v)}
        className="rounded-full px-4 py-2 bg-core-violet shadow-soft text-sm font-medium"
      >
        {open ? 'Fermer' : 'Ask CORE'}
      </button>
    </div>
  )
}
