import React from 'react'

export default function PageHeader({ title, subtitle, right }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h1 className="h1">{title}</h1>
        {subtitle && <p className="text-neutral-100/70 mt-1">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}
