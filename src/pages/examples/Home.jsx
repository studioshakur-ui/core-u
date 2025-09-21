import React from 'react'
import HeroSlider from '../../components/ui/HeroSlider.jsx'
import { Card } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

export default function Home() {
  return (
    <div className="p-6">
      <HeroSlider />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="p-5">
          <h3 className="h3 mb-1">Accedi</h3>
          <p className="text-sm text-neutral-100/70">SSO, magic link, langues, statut service.</p>
        </Card>
        <Card className="p-5">
          <h3 className="h3 mb-1">Manager</h3>
          <p className="text-sm text-neutral-100/70">Assignations, DnD, import Excel avec dry-run.</p>
        </Card>
        <Card className="p-5">
          <h3 className="h3 mb-1">Direzione</h3>
          <p className="text-sm text-neutral-100/70">KPIs S vs S-1, coûts estimés, risques.</p>
        </Card>
      </div>
      <div className="mt-6 flex gap-3">
        <Button>Commencer</Button>
        <Button variant="outline">Voir la démo</Button>
      </div>
    </div>
  )
}
