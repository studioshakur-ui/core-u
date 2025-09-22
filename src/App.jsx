import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900">CORE v9.1</h1>
        <p className="text-slate-600 mt-2">Si tu vois ce bloc stylé, Tailwind fonctionne ✅</p>
        <div className="mt-4 flex gap-3">
          <Link className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500" to="/capo">Capo</Link>
          <a className="px-4 py-2 rounded-xl bg-slate-900 text-white" href="/.netlify/functions/ai">Fn check</a>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4">
          <Link to="/" className="font-semibold text-slate-900">CORE</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-600 hover:text-slate-900">Home</Link>
            <Link to="/capo" className="text-slate-600 hover:text-slate-900">Capo</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* garde tes autres routes ici */}
      </Routes>
    </div>
  )
}
