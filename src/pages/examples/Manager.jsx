import React from 'react'
import PageHeader from '../../components/layout/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'

export default function Manager() {
  return (
    <div className="p-6">
      <PageHeader title="Manager — Planification" subtitle="Assignez vos équipes pour la semaine S" right={<Button>Importer Excel</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>Equipe #{i+1} — DnD disponible (halo)</Card>
        ))}
      </div>
    </div>
  )
}
