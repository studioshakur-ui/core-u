import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold">CORE v9.1</h1>
        <p className="text-slate-600 mt-2">Accès direct Capo. Aucun lien ou mention de manager/direzione.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/capo" className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">Entrer (Capo)</Link>
          <Link to="/login" className="px-4 py-2 rounded-xl border">Login</Link>
        </div>
      </div>
    </main>
  )
}
