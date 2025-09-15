import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useSession } from './hooks/useSession'
import { readRole, ROLES } from './auth/roles'
import ManagerHub from './pages/ManagerHub.jsx'
import Capo from './pages/Capo.jsx'
import Catalog from './pages/Catalog.jsx'
import DemoCenter from './pages/DemoCenter.jsx'
import Direzione from './pages/Direzione.jsx'
import ToastHost from './components/Toast.jsx'
import HeroSlider from './components/HeroSlider.jsx'
import AssistantFab from './components/AssistantFab.jsx'
import LoginModal from './components/LoginModal.jsx'
import HeaderStatus from './components/HeaderStatus.jsx'
import Protected from './components/Protected.jsx'

function Nav(){
  const [login,setLogin]=useState(false)
  const { session } = useSession()
  const role = readRole(session)
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-14">
        <a href="#/" className="flex items-center gap-2 font-bold tracking-wide">
          <img src="/assets/logo-core.png" alt="CORE" className="w-8 h-8" /> CORE
        </a>
        {role && <NavLink to="/direzione" className={({isActive})=> "px-3 py-2 rounded-xl "+(isActive?"bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")}>Direzione</NavLink>}
        {[ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <NavLink to="/manager" className={({isActive})=> "px-3 py-2 rounded-xl "+(isActive?"bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")}>Manager</NavLink>}
        {[ROLES.CAPO,ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <NavLink to="/capo" className={({isActive})=> "px-3 py-2 rounded-xl "+(isActive?"bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")}>Capo</NavLink>}
        {[ROLES.MANAGER,ROLES.DIREZIONE].includes(role) && <NavLink to="/catalog" className={({isActive})=> "px-3 py-2 rounded-xl "+(isActive?"bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")}>Catalogo</NavLink>}
        <NavLink to="/demo" className={({isActive})=> "px-3 py-2 rounded-xl "+(isActive?"bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")}>Demo</NavLink>
        <div className="ml-auto flex items-center gap-3">
          <HeaderStatus/>
          {session
            ? <button className="btn" onClick={()=>supabase.auth.signOut()}>Logout</button>
            : <button className="btn" onClick={()=>setLogin(true)}>Login</button>
          }
        </div>
        <LoginModal open={login} onClose={()=>setLogin(false)}/>
      </div>
    </nav>
  )
}

function Home(){
  return (<>
    <HeroSlider/>
    <section className="max-w-6xl mx-auto px-4 py-6" id="main">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-e1">
        <h2 className="text-xl font-semibold">Cosa puoi fare subito</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
          <li>Importare <b>PROGRAMMA</b> → <b>Organigramma</b></li>
          <li>Pianificare la settimana e vedere conflitti/capacità</li>
          <li>Rapportino Capo con limite 12h + allegati</li>
          <li>Catalogo versionato (Dry-Run/Diff/Commit) con Journal</li>
        </ul>
      </div>
    </section>
  </>)
}

export default function App(){
  return (<>
    <Nav/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/direzione" element={<Protected allow={[ROLES.DIREZIONE,ROLES.MANAGER,ROLES.CAPO]}><Direzione/></Protected>}/>
      <Route path="/manager" element={<Protected allow={[ROLES.MANAGER,ROLES.DIREZIONE]}><ManagerHub/></Protected>}/>
      <Route path="/capo" element={<Protected allow={[ROLES.CAPO,ROLES.MANAGER,ROLES.DIREZIONE]}><Capo/></Protected>}/>
      <Route path="/catalog" element={<Protected allow={[ROLES.MANAGER,ROLES.DIREZIONE]}><Catalog/></Protected>}/>
      <Route path="/demo" element={<DemoCenter/>}/>
    </Routes>
    <AssistantFab/>
    <ToastHost/>
  </>)
}
