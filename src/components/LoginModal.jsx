import React from 'react'
export default function LoginModal({open,onClose}){
  if(!open) return null
  return (<div className="modal" role="dialog" aria-modal="true" aria-label="Login">
    <div>
      <div className="text-lg font-semibold mb-2">Accedi</div>
      <label className="block text-sm mb-2">Email<input className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
      <label className="block text-sm mb-2">Password<input type="password" className="w-full px-3 py-2 rounded-xl border border-slate-300" /></label>
      <div className="text-right"><button className="btn" onClick={onClose}>Chiudi</button><button className="btn-primary ml-2" onClick={onClose}>Entra</button></div>
    </div>
  </div>)
}