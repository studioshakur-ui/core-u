import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Capo from './pages/Capo'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar.jsx'
import Protected from './components/Protected'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Capo seulement, pas d’URL manager/direzione */}
        <Route path="/capo" element={
          <Protected><Capo /></Protected>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
