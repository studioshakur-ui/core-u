import React from 'react'
export default function AIConfidenceBadge({ value=0 }){
  const level = value >= 0.85 ? 'Alta' : value >= 0.6 ? 'Media' : 'Bassa'
  const color = value >= 0.85 ? '#16a34a' : value >= 0.6 ? '#f59e0b' : '#dc2626'
  return (
    <span style={{padding:'4px 8px', borderRadius:8, background:color+'20', color, fontWeight:600}}>
      IA {level} ({Math.round(value*100)}%)
    </span>
  )
}
