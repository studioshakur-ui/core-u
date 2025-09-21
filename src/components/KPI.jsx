import React from 'react'
export default function KPI({label,value,delta}){
  const up = delta>0, dn=delta<0
  const c = up?'text-green-600':dn?'text-red-600':'text-gray-500'
  const a = up?'▲':dn?'▼':'•'
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold">{value}</div>
        <div className={"text-xs font-semibold "+c}>{a} {Math.abs(delta)}%</div>
      </div>
    </div>
  )
}
