// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

// Garde tes imports existants
import { supabase } from "./lib/supabaseClient";
import { useSession } from "./hooks/useSession";
import { readRole, ROLES } from "./auth/roles";

/* =========================================================
   NAV BAR (premium blur, sans logo)
========================================================= */
function NavBar({ onLogin, onLogout, session, role }) {
  const link = ({ isActive }) =>
    "px-3 py-2 rounded-xl " +
    (isActive
      ? "bg-white/10 text-white"
      : "text-white/80 hover:bg-white/10");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center gap-3">
        {/* Branding typographique uniquement */}
        <a href="#/" className="text-white font-semibold tracking-wide text-lg">
          CORE
        </a>

        <NavLink to="/demo" className={link}>Demo</NavLink>
        {!!role && <NavLink to="/direzione" className={link}>Direzione</NavLink>}
        {[ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && (
          <NavLink to="/manager" className={link}>Manager</NavLink>
        )}
        {[ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && (
          <NavLink to="/capo" className={link}>Capo</NavLink>
        )}
        {[ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && (
          <NavLink to="/catalog" className={link}>Catalogo</NavLink>
        )}

        <div className="ml-auto flex items-center gap-3">
          {/* Chip d’état de session avec label (a11y OK) */}
          <span
            className={
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs " +
              (session
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-rose-500/20 text-rose-300")
            }
          >
            <span
              className={
                "w-2 h-2 rounded-full " +
                (session ? "bg-emerald-400 animate-pulse" : "bg-rose-400")
              }
            />
            {session
              ? (role ? `Connesso · ${role}` : "Connesso")
              : "Non connesso"}
          </span>

          {session ? (
            <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
          ) : (
            <button className="btn btn-primary" onClick={onLogin}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   HERO (image fixe + overlay, sans logo)
========================================================= */
function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[520px] overflow-hidden bg-[#0f1117]">
      {/* Image de fond réaliste (mets public/assets/hero.jpg) */}
      <img
        src="/assets/hero.jpg"
        alt="Shipyard"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/20" />

      {/* Contenu */}
      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">CORE</h1>
        <p className="mt-3 text-lg md:text-2xl tracking-widest text-white/85">
          CONTROLLA • ORGANIZZA • RIPORTA • ESEGUI
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a
            href="#/demo"
            className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#0b0b0b]
                       bg-[--core-accent] shadow-[0_10px_25px_rgba(0,255,156,.25)]
                       transition will-change-transform hover:-translate-y-px active:translate-y-0
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[--core-accent]"
          >
            Inizia la Demo
            <span aria-hidden className="absolute inset-0 -z-10 rounded-xl blur-xl bg-[--core-accent]/40" />
          </a>

          <a
            href="#main"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium
                       border border-white/25 text-white/90 hover:bg-white/10
                       transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Scopri
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FEATURES (cartes 3D, icônes inline → aucune dépendance)
========================================================= */
function IconBox({ children }) {
  return (
    <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-white/10 border border-white/15">
      {children}
    </div>
  );
}
const IcoCpu = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[--core-accent] fill-none stroke-current">
    <path d="M4 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" strokeWidth="1.6"/>
    <path d="M9 9h6v6H9z" strokeWidth="1.6"/>
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" strokeWidth="1.6"/>
  </svg>
);
const IcoCal = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[--core-accent] fill-none stroke-current">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.6"/>
    <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.6"/>
  </svg>
);
const IcoFile = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[--core-accent] fill-none stroke-current">
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" strokeWidth="1.6"/>
    <path d="M14 2v6h6" strokeWidth="1.6"/>
    <path d="M9 13h6M9 17h6" strokeWidth="1.6"/>
  </svg>
);
const IcoBranch = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[--core-accent] fill-none stroke-current">
    <circle cx="6" cy="6" r="2" strokeWidth="1.6"/>
    <circle cx="18" cy="6" r="2" strokeWidth="1.6"/>
    <circle cx="18" cy="18" r="2" strokeWidth="1.6"/>
    <path d="M8 6h8M6 8v6a4 4 0 0 0 4 4h6" strokeWidth="1.6"/>
  </svg>
);

function Features() {
  const items = [
    { icon: <IcoCpu/>,  t: "Importa PROGRAMMA → Organigramma", d: "Allinea ruoli e squadre dal file, in pochi secondi." },
    { icon: <IcoCal/>,  t: "Pianificazione settimanale",       d: "Capacità, conflitti e copertura: chi fa cosa, quando." },
    { icon: <IcoFile/>, t: "Rapportino Capo (≤12h) + allegati", d: "Regole chiare, prove fotografiche e firma in app." },
    { icon: <IcoBranch/>, t: "Catalogo versionato",             d: "Dry-Run · Diff · Commit · Journal per modifiche tracciate." },
  ];
  return (
    <section id="main" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-white mb-8">Cosa puoi fare subito</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <article key={i} className="card group relative overflow-hidden">
              <div className="absolute -inset-1 rounded-2xl bg-[--core-accent]/0 blur-2xl transition group-hover:bg-[--core-accent]/10" />
              <div className="relative z-10 flex gap-4">
                <IconBox>{it.icon}</IconBox>
                <div>
                  <h3 className="text-white font-semibold text-lg">{it.t}</h3>
                  <p className="text-white/70 mt-1">{it.d}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LOGIN MODAL (Magic Link)
========================================================= */
function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/#/" }
    });
    setMsg(error ? "❌ " + error.message : "✅ Lien envoyé. Vérifie ton email.");
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60">
      <div className="w-[92%] max-w-md rounded-2xl border border-white/10 bg-[#0b0f14]/90 backdrop-blur-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Accedi</h3>
          <button className="text-white/70 hover:text-white" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-[--core-accent]"
              placeholder="tuo@email.com"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Chiudi</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Invio…" : "Entra (Magic Link)"}
            </button>
          </div>

          {msg && (
            <p className={"text-sm " + (msg.startsWith("✅") ? "text-emerald-400" : "text-rose-400")}>
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   APP – assemblage
========================================================= */
export default function App() {
  const { session } = useSession?.() || {};
  const role = (() => { try { return readRole?.(session) } catch { return null } })();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <NavBar
        session={session}
        role={role}
        onLogin={() => setLoginOpen(true)}
        onLogout={() => supabase.auth.signOut()}
      />

      <main className="bg-[#0f1117] text-white pt-14">
        <Hero />
        <Features />
      </main>

      {/* Tes routes publiques si besoin */}
      <Routes>
        <Route path="/demo" element={<div />} />
      </Routes>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
