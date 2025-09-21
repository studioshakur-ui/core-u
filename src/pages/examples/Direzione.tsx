import * as React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { KPI } from '@/components/ui/KPI';
import { Card } from '@/components/ui/Card';

export default function Direzione() {
  return (
    <div className="p-6">
      <PageHeader title="Direzione — KPIs" subtitle="Vue exécutive & comparatif S vs S-1" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KPI label="Couverture" value="92%" delta={3.2} />
        <KPI label="Non assignés" value={12} delta={-1.1} />
        <KPI label="Coût estimé (€)" value={128400} delta={2.4} />
      </div>
      <Card>Graphes comparatifs S/S-1 (placeholder)</Card>
    </div>
  );
}
