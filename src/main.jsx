import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const el = document.getElementById('root')
if (!el) {
  console.error('❌ #root introuvable dans index.html')
} else {
  const root = createRoot(el)
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  )
  // Signale au watchdog que React a démarré
  window.__CORE_BOOT_OK__ = true
}
