import React from 'react'
export default function DemoCenter(){
  return (<div className="max-w-6xl mx-auto p-4 space-y-3">
    <h2 className="text-xl font-semibold">Demo proofs (7)</h2>
    <ol className="list-decimal pl-6 space-y-1 text-slate-700">
      <li>Chiusura/Correzione audit</li>
      <li>Import idempotente (Dry-Run/Diff/Commit/Rollback)</li>
      <li>Conflitto bloccato dal server (validazione simulata)</li>
      <li>PJ >8MB compressa + hash + link firmato breve</li>
      <li>PDF hash change (allegato alterato ⇒ hash diverso)</li>
      <li>RLS “capo perimetro” (spec SQL in /docs/rls.sql)</li>
      <li>IA con ragioni + fonti di fallback</li>
    </ol>
    <p className="text-slate-600">Nota: demo simulate lato FE per la presentazione.</p>
  </div>)
}