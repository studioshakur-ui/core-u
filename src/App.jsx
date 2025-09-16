import React, { useEffect, useMemo, useState, Component } from "react"
import { Routes, Route, NavLink, useNavigate } from "react-router-dom"
import { supabase } from "./lib/supabaseClient"
import { useSession } from "./hooks/useSession"
import { readRole, ROLES } from "./auth/roles"

// Pages
import ManagerHub from "./pages/ManagerHub.jsx"
import Capo from "./pages/Capo.jsx"
import Catalog from "./pages/Catalog.jsx"
import DemoCenter from "./pages/DemoCenter.jsx"
import Direzione from "./pages/Direzione.jsx"

// UI
import ToastHost from "./components/Toast.jsx"
import HeroSlider from "./components/HeroSlider.jsx"
import AssistantFab from "./components/AssistantFab.jsx"
import LoginModal from "./components/LoginModal.jsx"
import HeaderStatus from "./components/HeaderStatus.jsx"
import Protected from "./components/Protected.jsx"

/* -----------------------------------------------------------
   ErrorBoundary intégré (évite écran noir si un composant jette)
----------------------------------------------------------- */
class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { err: null } }
  static getDerivedStateFromError(err){ return { err } }
  componentDidCatch(err, info){ console.error("Boundary", err, info) }
  render(){
    if (this.state.err) {
      return (
        <div style={{minHeight:"100vh",background:"#000",color:"#fff",padding:20,fontFamily:"system-ui"}}>
          <h1>⚠️ Errore UI</h1>
          <p style={{opacity:.9}}>{String(this.state.err?.message || this.state.err)}</p>
          <a href="#/debug" style={{color:"#38bdf8",textDecoration:"underline"}}>Apri debug</a>
        </div>
      )
    }
    return this.props.children
  }
}

/* -----------------------------------------------------------
   Utils
----------------------------------------------------------- */
function safeReadRole(session){
  try {
    const r = readRole?.(session)
    const all = Object.values(ROLES || {})
    return all.includes(r) ? r : null
  } catch(e){
    console.error("readRole error:", e)
    return null
  }
}

function DebugBanner(){
  const { session } = useSession() || {}
  const role = safeReadRole(session)
  const urlSet = !!import.meta.env.VITE_SUPABASE_URL
  const keySet = !!import.meta.env.VITE_SUPABASE_ANON_KEY
  return (
    <div className="px-3 py-1 text-xs text-white bg-black/60">
      SB_URL: {urlSet ? "set" : "MISSING"} · SB_KEY: {keySet ? "set" : "MISSING"} ·
      {" "}user: {session?.user?.email || "anon"} · role: {role || "—"}
    </div>
  )
}

/* -----------------------------------------------------------
   Nav
----------------------------------------------------------- */
function Nav(){
  const [login, setLogin] = useState(false)
  const { session } = useSession() || {}
  const role = safeReadRole(session)

  const can = useMemo(() => ({
    direzione: !!role, // ou limite stricte: [ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO].includes(role)
    manager:   [ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
    capo:      [ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
    catalog:   [ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
  }), [role])

  const cx = (isActive) =>
    "px-3 py-2 rounded-xl " + (isActive ? "bg-emerald-100 text-emerald-900" : "text-slate-700 hover:bg-slate-100")

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-14">
        <a href="#/" className="flex items-center gap-2 font-bold tracking-wide">
          <img src="/assets/logo-core.png" alt="CORE" className="w-8 h-8" /> CORE
        </a>

        {can.direzione && <NavLink to="/direzione" className={({isActive})=>cx(isActive)}>Direzione</NavLink>}
        {can.manager   && <NavLink to="/manager"   className={({isActive})=>cx(isActive)}>Manager</NavLink>}
        {can.capo      && <NavLink to="/capo"      className={({isActive})=>cx(isActive)}>Capo</NavLink>}
        {can.catalog   && <NavLink to="/catalog"   className={({isActive})=>cx(isActive)}>Catalogo</NavLink>}
        <NavLink to="/demo" className={({isActive})=>cx(isActive)}>Demo</NavLink>

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

/* -----------------------------------------------------------
   Pages simples
----------------------------------------------------------- */
function Home(){
  return (
    <>
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
    </>
  )
}

function NotFound(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border border-red-200 text-red-700 rounded-xl p-5">
        ❌ Page introuvable (route errata). Vérifie l’URL ou le menu.
      </div>
    </div>
  )
}

/* -----------------------------------------------------------
   App
----------------------------------------------------------- */
export default function App(){
  // écoute l’auth pour forcer un refresh propre si besoin
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().finally(()=> mounted && setReady(true))
    const { data: sub } = supabase.auth.onAuthStateChange(() => {})
    return () => sub?.subscription?.unsubscribe()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="animate-pulse opacity-80">Avvio…</div>
      </div>
    )
  }

  return (
    <>
      <DebugBanner />
      <Nav />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/main" element={<Home/>} /> {/* alias pour éviter confusion */}

          <Route
            path="/direzione"
            element={
              <Protected allow={[ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO]}>
                <Direzione />
              </Protected>
            }
          />
          <Route
            path="/manager"
            element={
              <Protected allow={[ROLES.MANAGER, ROLES.DIREZIONE]}>
                <ManagerHub />
              </Protected>
            }
          />
          <Route
            path="/capo"
            element={
              <Protected allow={[ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE]}>
                <Capo />
              </Protected>
            }
          />
          <Route
            path="/catalog"
            element={
              <Protected allow={[ROLES.MANAGER, ROLES.DIREZIONE]}>
                <Catalog />
              </Protected>
            }
          />

          <Route path="/demo" element={<DemoCenter/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </ErrorBoundary>

      <AssistantFab />
      <ToastHost />
    </>
  )
}
