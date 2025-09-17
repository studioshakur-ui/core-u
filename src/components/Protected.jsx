import React from "react";
import { useSession } from "../hooks/useSession";
import { readRole } from "../auth/roles";

export default function Protected({ allow = [], children }){
  const { session, loading } = useSession();
  if(loading) return <div className="container-core py-16">Caricamento…</div>;
  const role = readRole(session);
  if(!session) return <div className="container-core py-16">Effettua il login.</div>;
  if(allow.length && !allow.includes(role)) return <div className="container-core py-16">Accesso negato.</div>;
  return children;
}
