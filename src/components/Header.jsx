import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Header(){
  const { profile, role, signOut, session } = useAuthStore();
  return (
    <header className="bg-white border-b border-core-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <img src="/assets/brand/logo-wordmark.svg" alt="CORE" className="h-6" />
        <nav className="flex gap-3 text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/capo" className="hover:underline">Capo</Link>
          <Link to="/manager" className="hover:underline">Manager</Link>
          <Link to="/direzione" className="hover:underline">Direzione</Link>
        </nav>
        <div className="ml-auto text-sm flex items-center gap-3">
          {session ? (<>
            <span className="text-core-muted">{profile?.email || "utente"} · {role || "n/a"}</span>
            <button onClick={signOut} className="px-3 py-1 rounded-md bg-core-violet text-white">Logout</button>
          </>) : (
            <Link to="/login" className="px-3 py-1 rounded-md bg-core-violet text-white">Accedi</Link>
          )}
        </div>
      </div>
    </header>
  );
}
