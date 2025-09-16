// src/components/LoginModal.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [roleReq, setRoleReq] = useState(null) // 'direzione' | 'manager' | 'capo' | null
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleMagicLink(e) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // redirection après clic sur le lien reçu par mail
          emailRedirectTo: window.location.origin + '/#/',
          data: roleReq ? { role_request: roleReq } : {}, // user_metadata
        },
      })
      if (error) setMsg('❌ ' + error.message)
      else setMsg('✅ Lien envoyé. Vérifie ta boîte mail.')
    } catch (err) {
      setMsg('❌ ' + (err?.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  const tabBtn =
    'px-3 py-1 rounded-full border text-sm ' +
    'border-slate-300 hover:bg-slate-100 data-[active=true]:bg-violet-100 data-[active=true]:border-violet-300'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[92%] max-w-md rounded-2xl bg-white shadow-xl">
        <div className="px-5 pt-5 pb-3 border-b">
          <h2 className="text-lg font-semibold">Accedi</h2>
        </div>

        <form onSubmit={handleMagicLink} className="px-5 py-4 space-y-4">
          {/* Rôle souhaité (facultatif) */}
          <div className="flex gap-2">
            {['direzione','manager','capo'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleReq(r === roleReq ? null : r)}
                className={tabBtn}
                data-active={roleReq === r}
                aria-pressed={roleReq === r}
              >
                {r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuo@email.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Action */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2"
            >
              Chiudi
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-4 py-2 bg-violet-600 text-white disabled:opacity-60"
            >
              {loading ? 'Invio…' : 'Entra (Magic Link)'}
            </button>
          </div>

          {/* Message */}
          {msg && (
            <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {msg}
            </p>
          )}

          {/* Aide */}
          <p className="text-xs text-slate-500">
            Tu recevras un email avec un lien. Clique-le pour être connecté.
          </p>
        </form>
      </div>
    </div>
  )
}
