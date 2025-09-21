import React from "react";
export default function KPI({ label, value, delta, hint }) {
  const sign = (delta ?? 0) > 0 ? "+" : "";
  const color = (delta ?? 0) >= 0 ? "text-green-600" : "text-red-600";
  return (
    <div className="bg-white rounded-lg border border-core-border shadow-e0 p-4 flex flex-col gap-1">
      <div className="text-sm text-core-muted">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className={`text-xs ${color}`}>{sign}{delta}%</div>
      {hint && <div className="text-[11px] text-core-muted mt-1">{hint}</div>}
    </div>
  );
}