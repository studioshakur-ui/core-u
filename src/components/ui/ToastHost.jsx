// src/components/ui/ToastHost.jsx
import React from "react";
import { useCoreStore } from "../../store/useCoreStore";

export default function ToastHost(){
  const toasts = useCoreStore(s => s.toasts);
  const dismiss = useCoreStore(s => s.dismissToast);
  return (
    <div className="toast-host">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <strong>{t.title || "Info"}</strong>
            <button onClick={()=>dismiss(t.id)} className="btn btn-ghost" style={{ padding:"2px 8px" }}>Chiudi</button>
          </div>
          {t.message && <div style={{ marginTop:4, opacity:.8 }}>{t.message}</div>}
        </div>
      ))}
    </div>
  );
}
