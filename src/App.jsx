import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import ManagerHub from './pages/ManagerHub.jsx'
import Capo from './pages/Capo.jsx'
import Catalog from './pages/Catalog.jsx'
import DemoCenter from './pages/DemoCenter.jsx'
import Direzione from './pages/Direzione.jsx'
import ToastHost from './components/Toast.jsx'
import HeroSlider from './components/HeroSlider.jsx'
import AssistantFab from './components/AssistantFab.jsx'
import LoginModal from './components/LoginModal.jsx'

function Nav(){
  const link = ({isActive}) => "px-3 py-2 rounded-xl " + (isActive? "bg-violet-100 text-violet-900":"text-slate-700 hover:bg-slate-100")
  const [login,setLogin]=useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-14">
        <a href="#/" className="flex items-center gap-2 font-bold tracking-wide">
          <img src="/assets/logo-core.png" alt="CORE" className="w-8 h-8" />
          CORE
        </a>
        <NavLink to="/manager" className={link}>Manager</NavLink>
        <NavLink to="/capo" className={link}>Capo</NavLink>
        <NavLink to="/catalog" className={link}>Catalogo</NavLink>
        <NavLink to="/direzione" className={link}>Direzione</NavLink>
        <NavLink to="/demo" className={link}>Demo</NavLink>
        <div className="ml-auto">
          <button className="btn" onClick={()=>setLogin(true)}>Login</button>
        </div>
        <LoginModal open={login} onClose={()=>setLogin(false)}/>
      </div>
    </nav>
  )
}

function Home(){
  return (<>
    <HeroSlider/>
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-e1">
        <h2 className="text-xl font-semibold">Cosa puoi fare subito</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
          <li>Importare <b>PROGRAMMA</b> → <b>Organigramma</b> (Capo = primo nome pulito)</li>
          <li>Pianificare la settimana e vedere conflitti/capacità per giorno</li>
          <li>Rapportino Capo con limite 12h + allegati firmati temporanei</li>
          <li>Catalogo versionato (Dry-Run/Diff/Commit) con Journal scaricabile</li>
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
      <Route path="/manager" element={<ManagerHub/>}/>
      <Route path="/capo" element={<Capo/>}/>
      <Route path="/catalog" element={<Catalog/>}/>
      <Route path="/direzione" element={<Direzione/>}/>
      <Route path="/demo" element={<DemoCenter/>}/>
    </Routes>
    <AssistantFab/>
    <ToastHost/>
  </>)
}