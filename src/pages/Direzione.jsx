import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import KPI from "../components/KPI";
import ChartSparkline from "../components/ChartSparkline";
import { fetchDashboard } from "../utils/dataClient";

export default function Direzione() {
  const [state, setState] = useState({ kpis: [], spark: [] });

  useEffect(() => {
    fetchDashboard().then(setState).catch(() => {});
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-semibold">Direzione</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {state.kpis.map((k, i) => (
            <KPI key={i} {...k} />
          ))}
        </div>

        {/* Sparkline */}
        <div className="bg-white rounded-lg border border-core-border shadow-e0 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Trend settimanale</h2>
            <span className="text-xs text-core-muted">Ultime 12 settimane</span>
          </div>
          <div className="text-core-violet">
            <ChartSparkline data={state.spark} />
          </div>
        </div>
      </main>
    </div>
  );
}
