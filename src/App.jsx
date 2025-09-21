import React, { useState } from 'react'
import Home from './pages/examples/Home.jsx'
import Accedi from './pages/examples/Accedi.jsx'
// … autres imports

const screens = { Home, Accedi /* … */ }

export default function App() {
  const [screen, setScreen] = useState('Home')
  const Screen = screens[screen]
  return (
    <div>
      <nav className="sticky top-0 bg-white/80 border-b border-neutral-25">
        <div className="mx-auto max-w-6xl px-4 py-2 flex gap-2">
          <strong>CORE v8.4</strong>
          {Object.keys(screens).map((s) => (
            <button key={s} onClick={() => setScreen(s)}>{s}</button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-6xl">
        <Screen />
      </main>
    </div>
  )
}
