import React from "react";

export function SkeletonLine({ className = "" }) {
  return <div className={`h-4 w-full rounded bg-white/10 animate-pulse ${className}`} />;
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card">
      <SkeletonLine className="h-5 w-2/3" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine key={i} />
        ))}
      </div>
    </div>
  );
}
