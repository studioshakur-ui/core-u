import React,{useEffect,useRef} from 'react'
export default function Drawer({open, title, children, onClose, footer}){
  const ref = useRef(null)
  useEffect(()=>{ if(open && ref.current){ ref.current.focus() } },[open])
  return (<>
    <div className={"drawer " + (open?'open':'')} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <button className="text-slate-500" onClick={onClose} aria-label="Chiudi">✕</button>
      </div>
      <div className="p-4 overflow-auto" style={{height:'calc(100% - 52px - 64px)'}}>{children}</div>
      <div className="p-3 border-t">{footer}</div>
    </div>
    {open && <div className="fixed inset-0 bg-black/20" onClick={onClose}/>}
  </>)
}