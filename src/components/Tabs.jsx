import React from 'react'
export default function Tabs({value,onChange,items}){
  return (
    <div className="flex items-center gap-2 mb-3" role="tablist">
      {items.map(it=> (
        <button key={it.value} role="tab" aria-selected={value===it.value} className={"px-3 py-2 rounded-xl border " + (value===it.value?'bg-primary text-white':'bg-white')} onClick={()=>onChange(it.value)}>{it.label}</button>
      ))}
    </div>
  )
}