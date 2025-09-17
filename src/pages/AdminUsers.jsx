// src/pages/AdminUsers.jsx
import { useState } from "react";

export default function AdminUsers(){
  return (
    <div className="container-core space-y-6">
      <h1 className="text-3xl font-semibold">Gestione utenti</h1>
      <CreateUserCard />
      <SetRoleCard />
      <DeleteUserCard />
    </div>
  );
}

function CreateUserCard(){
  const [email,setEmail]=useState(""); const [pwd,setPwd]=useState(""); const [role,setRole]=useState("capo");
  const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  async function submit(e){
    e.preventDefault(); setMsg(""); setErr("");
    try{
      const res=await fetch("/.netlify/functions/admin-create-user",{
        method:"POST", headers:{ "content-type":"application/json" },
        body:JSON.stringify({ email, password: pwd, role })
      });
      const t=await res.text(); if(!res.ok) throw new Error(t);
      setMsg(`Creato utente ${email}`); setEmail(""); setPwd("");
    }catch(e){ setErr(e.message||String(e)); }
  }
  return (
    <form onSubmit={submit} className="card space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Crea utente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block mb-1">Email</span>
          <input className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </label>
        <label className="block">
          <span className="block mb-1">Password iniziale</span>
          <input type="password" className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={pwd} onChange={e=>setPwd(e.target.value)} required/>
        </label>
        <label className="block">
          <span className="block mb-1">Ruolo</span>
          <select className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="capo">capo</option>
            <option value="manager">manager</option>
            <option value="direzione">direzione</option>
          </select>
        </label>
      </div>
      <button className="btn btn-primary">Crea</button>
      {msg && <div className="text-emerald-400">{msg}</div>}
      {err && <div className="text-red-400">{err}</div>}
      <p className="muted text-sm">L’utente potrà cambiare la password da “Password dimenticata”.</p>
    </form>
  );
}

function SetRoleCard(){
  const [email,setEmail]=useState(""); const [role,setRole]=useState("capo");
  const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  async function submit(e){
    e.preventDefault(); setMsg(""); setErr("");
    try{
      const res=await fetch("/.netlify/functions/admin-set-role",{
        method:"POST", headers:{ "content-type":"application/json" },
        body:JSON.stringify({ email, role })
      });
      const t=await res.text(); if(!res.ok) throw new Error(t);
      setMsg(`Ruolo aggiornato a ${role} per ${email}`);
    }catch(e){ setErr(e.message||String(e)); }
  }
  return (
    <form onSubmit={submit} className="card space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Cambia ruolo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block mb-1">Email</span>
          <input className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required/>
        </label>
        <label className="block">
          <span className="block mb-1">Nuovo ruolo</span>
          <select className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="capo">capo</option>
            <option value="manager">manager</option>
            <option value="direzione">direzione</option>
          </select>
        </label>
      </div>
      <button className="btn btn-primary">Aggiorna</button>
      {msg && <div className="text-emerald-400">{msg}</div>}
      {err && <div className="text-red-400">{err}</div>}
    </form>
  );
}

function DeleteUserCard(){
  const [email,setEmail]=useState(""); const [msg,setMsg]=useState(""); const [err,setErr]=useState("");
  async function submit(e){
    e.preventDefault(); setMsg(""); setErr("");
    try{
      const res=await fetch("/.netlify/functions/admin-delete-user",{
        method:"POST", headers:{ "content-type":"application/json" },
        body:JSON.stringify({ email })
      });
      const t=await res.text(); if(!res.ok) throw new Error(t);
      setMsg(`Utente ${email} eliminato`); setEmail("");
    }catch(e){ setErr(e.message||String(e)); }
  }
  return (
    <form onSubmit={submit} className="card space-y-3 max-w-xl">
      <h2 className="text-xl font-semibold">Revoca accesso (elimina)</h2>
      <label className="block">
        <span className="block mb-1">Email</span>
        <input className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required/>
      </label>
      <button className="btn btn-ghost">Elimina utente</button>
      {msg && <div className="text-emerald-400">{msg}</div>}
      {err && <div className="text-red-400">{err}</div>}
      <p className="muted text-sm">L’eliminazione rimuove anche il profilo.</p>
    </form>
  );
}
