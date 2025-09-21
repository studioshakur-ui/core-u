import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Manager from './pages/Manager'
import Capo from './pages/Capo'
import Direzione from './pages/Direzione'
import Catalogo from './pages/Catalogo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="/capo" element={<Capo />} />
      <Route path="/direzione" element={<Direzione />} />
      <Route path="/catalogo" element={<Catalogo />} />
    </Routes>
  )
}
