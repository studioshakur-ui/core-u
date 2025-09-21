import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";

export default function LoginPage() {
  const { signIn, signOut, session, profile } = useAuthStore();
  const [email, setEmail] = useState("manager@example.com");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("manager");

  const doLogin = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      // dev mode: just set role locally
      await signIn(email, password);
      // overwrite role in dev
      useAuthStore.setState({ profile: { role, email } });
      return;
    }
    await signIn(email, password);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-e1 p-4 max-w-md">
        <div className="text-sm text-neutral-500 mb-2">Login</div>
        <div className="space-y-2">
          <input className="w-full border rounded px-3 py-2" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {!import.meta.env.VITE_SUPABASE_URL && (
            <div className="flex items-center gap-2 text-sm">
              <span>Ruolo (dev):</span>
              <select className="border rounded px-2 py-1" value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value="capo">capo</option>
                <option value="manager">manager</option>
                <option value="direzione">direzione</option>
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded bg-black text-white" onClick={doLogin}>Login</button>
            <button className="px-3 py-2 rounded bg-neutral-200" onClick={signOut}>Logout</button>
          </div>
          <div className="text-xs text-neutral-600">
            {session ? <>Connesso come <b>{profile?.email}</b> (ruolo: <b>{profile?.role}</b>)</> : "Non connesso"}
          </div>
        </div>
      </div>
      {!import.meta.env.VITE_SUPABASE_URL && (
        <div className="text-xs text-neutral-600">
          Modalità DEV: Supabase non configurato — login e ruoli simulati localmente.
        </div>
      )}
    </div>
  );
}
