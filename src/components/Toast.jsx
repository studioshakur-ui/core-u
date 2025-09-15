import React from 'react'
import { useCoreStore } from '../store/useCoreStore'
export default function ToastHost(){
  const { toasts, removeToast } = useCoreStore()
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[1000]" role="region" aria-live="polite">
      {toasts.map(t=> (
        <div key={t.id} className="bg-white border border-slate-200 rounded-xl shadow-e1 px-3 py-2 min-w-[260px]" role={t.type==='error'?'alert':'status'}>
          <div className="font-medium">{t.title||'Info'}</div>
          {t.message && <div className="text-sm text-slate-600">{t.message}</div>}
          <div className="text-right mt-1">
            <button className="text-xs text-slate-500 hover:text-slate-800 underline" onClick={()=>removeToast(t.id)}>fermer</button>
          </div>
        </div>
      ))}
    </div>
  )
}