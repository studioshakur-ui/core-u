import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useEffect, useState } from 'react'
export default function Navbar(){
  const [user,setUser]=useState(null); const [role,setRole]=useState(null); const navigate=useNavigate()
  useEffect(()=>{ let m=true; async function load(){ const { data:{ user } }=await supabase.auth.getUser(); if(!m)return; setUser(user); if(user){ const { data: mem }=await supabase.from('memberships').select('role').limit(1).maybeSingle(); setRole(mem?.role||null) } else setRole(null) } load(); const { data: sub }=supabase.auth.onAuthStateChange(()=>load()); return ()=>{sub?.subscription?.unsubscribe?.(); m=false}},[])
  async function logout(){ await supabase.auth.signOut(); navigate('/') }
  return (<header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur"><div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
    <Link to="/" className="font-semibold tracking-wide"><span className="text-core-violet">CORE</span> v11</Link>
    <nav className="flex-1 flex gap-3 text-sm"><Link to="/" className="hover:opacity-80">Home</Link>{role==='capo'&&<Link to="/capo" className="hover:opacity-80">Capo</Link>}{role==='manager'&&<Link to="/manager" className="hover:opacity-80">Manager</Link>}{role==='direzione'&&<Link to="/direzione" className="hover:opacity-80">Direzione</Link>}{(role==='manager'||role==='direzione')&&<Link to="/import" className="hover:opacity-80">Importa</Link>}</nav>
    {user? <button onClick={logout} className="rounded-xl2 bg-core-violet px-3 py-1.5 text-sm font-medium hover:opacity-90">Logout</button> : <Link to="/login" className="rounded-xl2 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">Login</Link>}
  </div></header>)
}
