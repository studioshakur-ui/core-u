import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Manager from './pages/Manager.jsx'
import Capo from './pages/Capo.jsx'
import Direzione from './pages/Direzione.jsx'
import { supabase } from './lib/supabase.js'

export default function App(){
  const [session,setSession]=useState(null)
  const navigate=useNavigate()

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session))
    const { data:sub }=supabase.auth.onAuthStateChange((_e,s)=>{ setSession(s); if(!s) navigate('/') })
    return ()=> sub?.subscription.unsubscribe()
  },[])

  return (<div>
    <nav className="bg-white shadow px-4 py-2 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/manager">Manager</Link>
      <Link to="/capo">Capo</Link>
      <Link to="/direzione">Direzione</Link>
      {session && <button onClick={()=>supabase.auth.signOut()}>Esci</button>}
    </nav>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/manager" element={<Manager/>}/>
      <Route path="/capo" element={<Capo/>}/>
      <Route path="/direzione" element={<Direzione/>}/>
    </Routes>
  </div>)
}
