import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSession(){
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    supabase.auth.getSession().then(({ data })=>{
      if(mounted) { setSession(data.session ?? null); setLoading(false); }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s)=>{
      setSession(s ?? null);
    });
    return ()=> { mounted=false; sub?.subscription?.unsubscribe(); }
  },[]);
  return { session, loading };
}
