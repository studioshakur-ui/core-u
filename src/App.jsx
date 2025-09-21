import React from 'react'
import Manager from './pages/Manager.jsx'
import Capo from './pages/Capo.jsx'

export default function App() {
  return (
    <div className="app">
      <h1 className="text-2xl font-bold text-center">CORE Wow</h1>
      <Manager />
      <Capo />
    </div>
  )
}
