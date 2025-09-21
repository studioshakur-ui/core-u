import React from 'react'
import PageHeader from '../../components/layout/PageHeader.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Badge } from '../../components/ui/Badge.jsx'

export default function Catalogo() {
  return (
    <div className="p-6">
      <PageHeader title="Catalogo Attività" subtitle="Navigation type Notion — cartes + badges HSE/PPE" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Cablaggio', 'Test isolamento', 'Installazione canaline', 'Crimpaggio'].map((title, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="h3">{title}</h3>
              <Badge variant={i % 2 ? 'hse-ok' : 'hse-ko'}>{i % 2 ? 'HSE OK' : 'HSE KO'}</Badge>
            </div>
            <p className="text-sm text-neutral-100/70">Durée std: {i%2? '4h':'6h'} — Crew: 2–3</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
