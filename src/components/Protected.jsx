import React from 'react'
import { useSession } from '../hooks/useSession'
import { readRole } from '../auth/roles'

export default function Protected({allow, children}){
  const { session, loading } = useSession()
  if(loading) return <div className="p-6 text-slate-600">Verifica sessione…</div>
  const role = readRole(session)
  if(!role || (allow && !allow.includes(role))) return <div className="p-6">Non autorizzato.</div>
  return children
}
