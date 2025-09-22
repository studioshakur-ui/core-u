import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase, getMyProfile } from '../lib/supabase'

export function RequireAuth({ children }) {
  const [state, setState] = useState({ ready: false, session: null })
  const loc = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState({ ready: true, session: data.session })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({ ready: true, session })
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!state.ready) return null
  if (!state.session) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

export function RoleRouter({ children }) {
  const [role, setRole] = useState('pending')
  useEffect(() => {
    getMyProfile().then(p => setRole(p?.role || 'guest'))
  }, [])

  if (role === 'pending') return null
  // si "capo" -> on laisse l’accès (Capo.jsx derrière RequireAuth)
  if (role === 'capo') return children
  // tout autre rôle -> Home (sans rien révéler)
  return <Navigate to="/" replace />
}
