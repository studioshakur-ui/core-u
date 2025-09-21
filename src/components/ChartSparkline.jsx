import React from "react";
export default function ChartSparkline({ data = [], width = 160, height = 48, strokeWidth = 2 }) {
  if (!data.length) return <div className="text-xs text-core-muted">No data</div>;
  const min = Math.min(...data), max = Math.max(...data);
  const range = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <polyline fill="none" stroke="currentColor" strokeWidth={strokeWidth} points={pts} />
    </svg>
  );
}