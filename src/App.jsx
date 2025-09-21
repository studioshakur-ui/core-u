import React, { useState } from 'react'
import Home from './pages/examples/Home.jsx'
import Accedi from './pages/examples/Accedi.jsx'
import Manager from './pages/examples/Manager.jsx'
import Capo from './pages/examples/Capo.jsx'
import Direzione from './pages/examples/Direzione.jsx'
import Catalogo from './pages/examples/Catalogo.jsx'
import Button from './components/ui/Button.jsx'

const screens = { Home, Accedi, Manager, Capo, Direzione, Catalogo }

export default function App() {
  const [screen, setScreen] = useState('Home')
  const Screen = screens[screen]
  return (
    <div>
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-25">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2">
          <img src="/logo-core.svg" alt="CORE" className="h-6" />
          <strong className="mr-4">CORE v8.4</strong>
          {Object.keys(screens).map((s) => (
            <Button
              key={s}
              variant={screen === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setScreen(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-6xl">
        <Screen />
      </main>
    </div>
  )
}
