import * as React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function Capo() {
  return (
    <div className="p-6">
      <PageHeader title="Capo — Saisie journalière" subtitle="Edition inline des activités" />
      <div className="grid gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>Operatore Rossi — 8h — Attività: Cablaggio</div>
            <Badge variant="success">OK</Badge>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>Operatore Bianchi — 13h — Attività: Test</div>
            <Badge variant="warning">> 12h</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
