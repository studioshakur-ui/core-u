import React from 'react'
type T = { id:string; text:string; kind?:'ok'|'warn'|'err' }
export const Toast: React.FC<{t:T, onDone: (id:string)=>void}> = ({t,onDone})=>{
  React.useEffect(()=>{ const id=setTimeout(()=>onDone(t.id),3000); return ()=>clearTimeout(id) },[t.id])
  return (<div className="card px-4 py-3 min-w-[220px] shadow-soft border border-white/5"><div className="text-sm">{t.text}</div></div>)
}
export const ToastProvider: React.FC = ({children}: any)=>{
  const [items,setItems]=React.useState<T[]>([])
  const push=(text:string, kind?:T['kind'])=> setItems((s)=>[...s,{id:Math.random().toString(36).slice(2), text, kind}])
  ;(window as any).toast = { push }
  return (<div className="relative">{children}<div className="fixed bottom-6 right-6 flex flex-col gap-2">{items.map(t=><Toast key={t.id} t={t} onDone={(id)=>setItems(s=>s.filter(x=>x.id!==id))} />)}</div></div>)
}