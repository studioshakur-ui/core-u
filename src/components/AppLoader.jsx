import React from "react";
export default function AppLoader({ label="Caricamento…" }){
  return (
    <div style={{ minHeight:"50vh", display:"grid", placeItems:"center" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span aria-hidden="true" style={{
          width:16, height:16, borderRadius:"50%",
          border:"2px solid #cbd5e1", borderTopColor:"#0ea5e9",
          animation:"spin 1s linear infinite"
        }}/>
        <span>{label}</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
