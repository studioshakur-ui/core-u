import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = (url && key) ? createClient(url, key) : null

export default function Protected({ children }){
  const [auth, setAuth] = useState(supabase ? undefined : true) // si pas de supabase -> open
  useEffect(()=>{
    if(!supabase) return
    supabase.auth.getSession().then(({ data })=>{
      setAuth(!!data?.session)
    })
  },[])
  if(auth === undefined) return <div className="p-6">...</div>
  if(!auth) return <Navigate to="/login" replace />
  return children
}
