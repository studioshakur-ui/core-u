import React from 'react'
import { Button } from './Button'
export const Modal: React.FC<{open:boolean; onClose:()=>void; title:string; footer?:React.ReactNode}> = ({open,onClose,title,children,footer})=>{
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Button variant="ghost" onClick={onClose} aria-label="Chiudi">✕</Button>
        </div>
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}