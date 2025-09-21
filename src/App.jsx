import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Manager from './pages/Manager.jsx'
import Capo from './pages/Capo.jsx'
import Direzione from './pages/Direzione.jsx'
import { supabase } from './lib/supabase.js'

export default function App(){
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    supabase.auth.getSession().then(({ data })=> setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s)=>{
      setSession(s)
      if(!s){ setRole(null); navigate('/') } else { fetchRole() }
    })
    fetchRole()
    return ()=> sub?.subscription.unsubscribe()
  },[])

  async function fetchRole(){
    const user = (await supabase.auth.getUser()).data.user
    if(!user) return
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const r = data?.role || null
    setRole(r)
    if(r==='manager') navigate('/manager')
    else if(r==='capo') navigate('/capo')
    else if(r==='direzione') navigate('/direzione')
  }

  return (
    <div className="min-h-screen">
      <nav className="nav sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src="/logo-core.svg" className="h-6" alt="CORE"/>
          <strong className="mr-4">CORE</strong>
          <Link to="/" className="btn-ghost">Home</Link>
          <Link to="/manager" className="btn-ghost">Manager</Link>
          <Link to="/capo" className="btn-ghost">Capo</Link>
          <Link to="/direzione" className="btn-ghost">Direzione</Link>
          <div className="ml-auto flex items-center gap-2">
            {session ? <button className="btn" onClick={()=>supabase.auth.signOut()}>Esci</button> : null}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/manager" element={<Manager/>}/>
          <Route path="/capo" element={<Capo/>}/>
          <Route path="/direzione" element={<Direzione/>}/>
        </Routes>
      </main>
    </div>
  )
}
