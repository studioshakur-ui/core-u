import React from "react";
export default function CardEditorial({title,desc,cta}){
  return (
    <div className="bg-white border border-core-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-core-muted mb-4">{desc}</p>
      <a className="text-core-red hover:underline">{cta||"Approfondisci →"}</a>
    </div>
  );
}
