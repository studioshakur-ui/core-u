// src/components/LoginModal.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleMagic(e) {
    e.preventDefault()
    setMsg(''); setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/#/' }
    })
    setMsg(error ? '❌ ' + error.message : '✅ Lien envoyé. Vérifie ton email.')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-md rounded-2xl bg-white shadow-xl">
        <div className="px-5 pt-5 pb-3 border-b">
          <h2 className="text-lg font-semibold">Accedi</h2>
        </div>

        <form onSubmit={handleMagic} className="px-5 py-4 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuo@email.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2">
              Chiudi
            </button>
            <button type="submit" disabled={loading} className="rounded-xl px-4 py-2 bg-violet-600 text-white disabled:opacity-60">
              {loading ? 'Invio…' : 'Entra (Magic Link)'}
            </button>
          </div>

          {msg && <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
          <p className="text-xs text-slate-500">Tu recevras un lien par email. Clique-le pour être connecté.</p>
        </form>
      </div>
    </div>
  )
}
