import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

async function fetchRole(userId){
  try {
    const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data?.role || null;
  } catch {
    return null;
  }
}

export default function Login(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e){
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) { setMsg({type:"error", text:error.message}); return; }
      const user = data?.user;
      if (!user) { setMsg({type:"error", text:"Accesso fallito."}); return; }
      const role = await fetchRole(user.id);
      if (role === "direzione") navigate("/direzione", { replace:true });
      else if (role === "manager") navigate("/manager", { replace:true });
      else navigate("/capo", { replace:true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth:480 }}>
      <h1 style={{ marginBottom:8 }}>Accedi</h1>
      <form onSubmit={onSubmit} style={{ display:"grid", gap:12 }}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required
          style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:12 }} />
        <label htmlFor="pwd">Password</label>
        <input id="pwd" type="password" autoComplete="current-password" value={pwd} onChange={e=>setPwd(e.target.value)} required
          style={{ padding:"10px 12px", border:"1px solid #cbd5e1", borderRadius:12 }} />
        <button type="submit" disabled={loading}
          style={{ padding:"10px 14px", borderRadius:12, border:"1px solid #0ea5e9", background:loading?"#93c5fd":"#0ea5e9", color:"#fff", fontWeight:700 }}>
          {loading ? "Connessione…" : "Entra"}
        </button>
      </form>
      {msg && <p style={{ marginTop:12, color: msg.type==="error" ? "#b91c1c" : "#166534" }}>{msg.text}</p>}
    </div>
  );
}
