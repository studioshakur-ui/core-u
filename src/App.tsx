import React from 'react'
import { Manager } from '@/routes/Manager'
export const App: React.FC = () => (
  <div className="min-h-screen">
    <header className="p-4 md:p-6 flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-semibold">Squadre</h1>
      <div className="flex items-center gap-2 text-sm text-[var(--subtle)]"><span>CORE v8.1 · IT</span></div>
    </header>
    <main className="px-4 md:px-6 pb-12"><Manager /></main>
  </div>
)