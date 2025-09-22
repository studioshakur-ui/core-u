import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    // fetch role
    const uid = data.user.id
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', uid).maybeSingle()
    const role = prof?.role || 'capo'
    if (role === 'capo') navigate('/capo')
    else if (role === 'manager') navigate('/manager')
    else if (role === 'direzione') navigate('/direzione')
    else navigate('/')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h2 className="text-2xl font-semibold">Connexion</h2>
      <p className="text-white/60 text-sm mt-1">Email & password via Supabase</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
          className="w-full rounded-lg bg-core-card px-3 py-2 outline-none"
        />
        <input
          type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
          className="w-full rounded-lg bg-core-card px-3 py-2 outline-none"
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button className="w-full rounded-lg bg-core-violet px-3 py-2 font-medium hover:opacity-90">Entrer</button>
      </form>
    </div>
  )
}
