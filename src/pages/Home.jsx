import React from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home(){
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">CORE</h1>
      <p className="text-slate-600 mb-6">
        Outil de rapport journalier. Connectez-vous pour accéder à votre interface.
      </p>

      <div className="flex gap-3">
        <Link to="/login" className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800">
          Login
        </Link>
        <Link to="/capo" className="px-4 py-2 rounded border">
          Aller à Capo (si déjà connecté)
        </Link>
      </div>

      <div className="mt-10 text-sm text-slate-500">
        { /* bouton debug logout utile sur le terrain */ }
        <button
          className="underline"
          onClick={() => supabase.auth.signOut()}
        >
          Se déconnecter
        </button>
      </div>
    </main>
  )
}
