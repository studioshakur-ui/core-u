import React, { useState, useMemo } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useSession } from './hooks/useSession'
import { readRole, ROLES } from './auth/roles'

// Pages
import ManagerHub from './pages/ManagerHub.jsx'
import Capo from './pages/Capo.jsx'
import Catalog from './pages/Catalog.jsx'
import DemoCenter from './pages/DemoCenter.jsx'
import Direzione from './pages/Direzione.jsx'

// UI
import ToastHost from './components/Toast.jsx'
import HeroSlider from './components/HeroSlider.jsx'
import AssistantFab from './components/AssistantFab.jsx'
import LoginModal from './components/LoginModal.jsx'
import HeaderStatus from './components/HeaderStatus.jsx'
import Protected from './components/Protected.jsx'

// ——— Util ———
function safeReadRole(session) {
  try {
    const r = readRole?.(session)
    if (!r) return null
    const values = Object.values(ROLES || {})
    return values.includes(r) ? r : null
  } catch (e) {
    console.error('readRole error:', e)
    return null
  }
}

function DebugBanner({ session }) {
  const role = safeReadRole(session)
  return (
    <div className="px-3 py-1 text-xs text-white bg-black/60">
      SB_URL: {import.meta.env.VITE_SUPABASE_URL ? 'set' : 'MISSING'} ·
      SB_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'MISSING'} ·
      user: {session?.user?.email || 'anon'} · role: {role || '—'}
    </div>
  )
}

function Nav() {
  const [login, setLogin] = useState(false)
  const { session } = useSession() || {}
  const role = safeReadRole(session)

  // Pour éviter les re-renders, on calcule la liste de tabs accessibles
  const can = useMemo(() => ({
    direzione: !!role, // si tu veux: [ROLES.DIREZIONE, ROLES.MANAGER, ROLES.CAPO].includes(role)
    manager: [ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
    capo: [ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
    catalog: [ROLES.MANAGER, ROLES.DIREZIONE].includes(role),
  }), [role])

  const cx = (isActive) =>
    'px-3 py-2 rounded-xl ' +
    (isActive ? 'bg-violet-100 text-violet-900' : 'text-slate-700 hover:bg-slate-100')

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 h-14">
        <a href="#/" className="flex items-center gap-2 font-bold tracking-wide">
          <img src="/assets/logo-core.png" alt="CORE" className="w-8 h-8" /> CORE
        </a>

        {can.direzione && (
          <NavLink to="/direzione" className={({ isActive }) => cx(isActive)}>
            Direzione
          </NavLink>
        )}
        {can.manager && (
          <NavLink to="/manager" className={({ isActive }) => cx(isActive)}>
            Manager
          </NavLink>
        )}
        {can.capo && (
          <NavLink to="/capo" className={({ isActive }) => cx(isActive)}>
            Capo
          </NavLink>
        )}
        {can.catalog && (
          <NavLink to="/catalog" className={({ isActive }) => cx(isActive)}>
            Catalogo
          </NavLink>
        )}
        <NavLink to="/demo" className={({ isActive }) => cx(isActive)}>
          Demo
        </NavLink>

        <div className="ml-auto flex items-center gap-3">
          <HeaderStatus />
          {session ? (
            <button className="btn" onClick={() => supabase.auth.signOut()}>
              Logout
            </button>
          ) : (
            <button className="btn" onClick={() => setLogin(true)}>
              Login
            </button>
          )}
        </div>

        <LoginModal open={login} onClose={() => setLogin(false)} />
      </div>
    </nav>
  )
}

function Home() {
  return (
    <>
      <HeroSlider />
      <section className="max-w-6xl mx-auto px-4 py-6" id="main">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-e1">
          <h2 className="text-xl font-semibold">Cosa puoi fare subito</h2>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-700">
            <li>
              Importare <b>PROGRAMMA</b> → <b>Organigramma</b>
            </li>
            <li>Pianificare la settimana e vedere conflitti/capacità</li>
            <li>Rapportino Capo con limite 12h + allegati</li>
            <li>Catalogo versionato (Dry-Run/Diff/Commit) con Journal</li>
          </ul>
        </div>
      </section>
    </>
  )
}

function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border border-red-200 text-red-700 rounded-xl p-5">
        ❌ Page introuvable (route errata). Vérifie l’URL ou le menu.
      </div>
    </div>
  )
}

export default function App() {
  // Banner debug optionnel (retire-le une fois que tout est ok)
  const { session } = useSession() || {}

  return (
    <>
      <DebugBanner session={session} />
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />

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

        <Route path="/demo" element={<DemoCenter />} />

        {/* Catch-all pour éviter l’écran noir */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AssistantFab />
      <ToastHost />
    </>
  )
}
