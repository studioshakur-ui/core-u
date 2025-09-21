import React from 'react'
import { cn } from '../../lib/utils.js'

export function KPI({ label, value, delta }) {
  const positive = typeof delta === 'number' && delta >= 0
  const negative = typeof delta === 'number' && delta < 0
  return (
    <div className={cn('card rounded-2xl p-4 shadow-e1')}>
      <div className="text-sm text-neutral-100 opacity-70">{label}</div>
      <div className="mt-1 font-heading text-2xl text-neutral-100">
        <span className="text-data">{value}</span>
      </div>
      {typeof delta === 'number' && (
        <div className={cn('mt-1 text-sm font-medium', positive && 'text-success', negative && 'text-danger')}>
          {positive ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
        </div>
      )}
    </div>
  )
}
