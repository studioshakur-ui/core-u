import React, { useState } from 'react'
import Manager from './pages/Manager.jsx'
import Capo from './pages/Capo.jsx'
import Direzione from './pages/Direzione.jsx'

export default function App() {
  const [tab, setTab] = useState('Manager')
  const tabs = ['Manager', 'Capo', 'Direzione']

  const Current = tab === 'Manager' ? Manager : tab === 'Capo' ? Capo : Direzione

  return (
    <div style={{minHeight:'100vh',background:'#f5f7f9'}}>
      <nav style={{
        position:'sticky',top:0,zIndex:10,background:'rgba(255,255,255,0.9)',
        backdropFilter:'blur(8px)',borderBottom:'1px solid #e5e7eb'
      }}>
        <div style={{maxWidth:1120,margin:'0 auto',padding:'12px 16px',display:'flex',alignItems:'center',gap:12}}>
          <img src="/logo-core.svg" alt="CORE" style={{height:24}}/>
          <strong style={{marginRight:12}}>CORE</strong>
          {tabs.map(t => (
            <button key={t}
              onClick={() => setTab(t)}
              style={{
                padding:'8px 12px',borderRadius:10,border:'1px solid #e5e7eb',
                background: tab===t ? '#16a34a' : '#fff',
                color: tab===t ? '#fff' : '#111827',
                cursor:'pointer'
              }}>
              {t}
            </button>
          ))}
        </div>
      </nav>
      <main style={{maxWidth:1120,margin:'0 auto'}}>
        <Current />
      </main>
    </div>
  )
}
