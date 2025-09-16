import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";        // garde ton client existant
import { useSession } from "./hooks/useSession";        // garde ton hook existant
import { readRole, ROLES } from "./auth/roles";         // garde tes rôles

/* ===================== NAV PREMIUM (blur) ===================== */
function NavBar({ onOpenLogin }) {
  const { session } = useSession() || {};
  const role = (() => { try { return readRole?.(session) } catch { return null } })();

  const link = ({ isActive }) =>
    "px-3 py-2 rounded-xl " + (isActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10");

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center gap-3">
        <a href="#/" className="flex items-center gap-2 text-white font-semibold tracking-wide">
          <img src="/assets/logo-core.png" className="w-8 h-8" alt="CORE" />
          CORE
        </a>

        {/* nav publique */}
        <NavLink to="/demo" className={link}>Demo</NavLink>

        {/* nav par rôles (affiche seulement si connecté avec rôle) */}
        {role && <NavLink to="/direzione" className={link}>Direzione</NavLink>}
        {[ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && <NavLink to="/manager" className={link}>Manager</NavLink>}
        {[ROLES.CAPO, ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && <NavLink to="/capo" className={link}>Capo</NavLink>}
        {[ROLES.MANAGER, ROLES.DIREZIONE].includes(role) && <NavLink to="/catalog" className={link}>Catalogo</NavLink>}

        <div className="ml-auto flex items-center gap-3">
          <span className={"inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs " + (session ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300")}>
            <span className={"w-2 h-2 rounded-full " + (session ? "bg-emerald-400" : "bg-rose-400")}></span>
            {session ? `Connesso${role ? ` · ${role}` : ""}` : "Non connesso"}
          </span>

          {session
            ? <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>Logout</button>
            : <button className="btn btn-primary" onClick={onOpenLogin}>Login</button>}
        </div>
      </div>
    </header>
  );
}

/* ===================== HERO VIDÉO ===================== */
/* Place la vidéo ici: public/assets/core-hero.mp4 (réaliste chantier) */
function Hero() {
  return (
    <section className="relative h-[82vh] min-h-[560px] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/core-hero.mp4" type="video/mp4" />
      </video>

      {/* overlay dégradé sombre */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/20" />

      {/* contenu */}
      <div className="relative h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        <img src="/assets/logo-core.png" alt="CORE" className="w-24 h-24 mb-4 opacity-95" />
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">CORE</h1>
        <p className="mt-3 text-lg md:text-2xl tracking-widest text-white/80">
          CONTROLLA • ORGANIZZA • RIPORTA • ESEGUI
        </p>

        <div className="mt-8 flex items-center gap-3">
          <a href="#/demo" className="btn btn-primary">Inizia la Demo</a>
          <a href="#main" className="btn btn-ghost">Scopri</a>
        </div>

        {/* watermark léger “premium” */}
        <div className="absolute bottom-6 right-6 text-xs text-white/40">v5</div>
      </div>
    </section>
  );
}

/* ===================== FEATURES ===================== */
function Features() {
  const items = [
    { t: "Importa PROGRAMMA → Organigramma", d: "Allinea ruoli e squadre da file." },
    { t: "Pianifica la settimana", d: "Capacità, conflitti e coperture." },
    { t: "Rapportino Capo (≤12h) + allegati", d: "Regole chiare, prove e foto." },
    { t: "Catalogo versionato", d: "Dry-Run · Diff · Commit · Journal." },
  ];
  return (
    <section id="main" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Cosa puoi fare subito</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((it, i) => (
            <div className="card text-white" key={i}>
              <h3 className="text-lg font-semibold">{it.t}</h3>
              <p className="mt-1 text-white/70">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== LOGIN MODAL (MAGIC LINK) ===================== */
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

          {msg && <p className={"text-sm " + (msg.startsWith("✅") ? "text-emerald-400" : "text-rose-400")}>{msg}</p>}
          <p className="text-xs text-white/50">Riceverai un link via email. Cliccalo per collegarti.</p>
        </form>
      </div>
    </div>
  );
}

/* ===================== APP ===================== */
export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <NavBar onOpenLogin={() => setLoginOpen(true)} />
      <main className="pt-14"> {/* offset de la nav fixe */}
        <Hero />
        <Features />
      </main>

      {/* routes existantes si tu veux (tu peux brancher tes pages actuelles) */}
      <Routes>
        <Route path="/demo" element={<div />} />
      </Routes>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
