import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function ProtectedRoute({ children, allowed = [] }) {
  const [state, setState] = useState({ loading: true, allowed: false })

  useEffect(() => {
    let mounted = true
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (mounted) setState({ loading: false, allowed: false })
        return
      }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      const ok = allowed.includes(prof?.role)
      if (mounted) setState({ loading: false, allowed: ok })
    }
    check()
    return () => { mounted = false }
  }, [allowed])

  if (state.loading) return <div className="p-8 text-sm opacity-70">Chargement…</div>
  if (!state.allowed) return <Navigate to="/" replace />
  return children
}
