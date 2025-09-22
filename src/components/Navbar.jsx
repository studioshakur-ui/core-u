import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        <Link to="/" className="font-semibold">CORE</Link>
        <nav className="flex gap-5 text-sm">
          <NavLink to="/" className={({isActive}) =>
            isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
          }>
            Home
          </NavLink>
          <NavLink to="/capo" className={({isActive}) =>
            isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
          }>
            Capo
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
