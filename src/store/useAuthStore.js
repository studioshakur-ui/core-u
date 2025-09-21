import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSupabase, getSupabaseInitError } from "../lib/supabaseClient";

const DEMO = (import.meta.env?.VITE_DEMO_MODE === "true");
const LOGIN_MODE = (import.meta.env?.VITE_LOGIN_MODE || "email");

const initial = {
  loading: false,
  error: null,
  session: null,
  profile: null,
  role: null,
  lastRequestedPath: null,
};

export const useAuthStore = create(persist((set, get) => ({
  ...initial,

  setLastRequestedPath: (path) => set({ lastRequestedPath: path }),

  init: async () => {
    if (DEMO) return;
    const supabase = getSupabase();
    if (!supabase) { set({ error: getSupabaseInitError() || "Supabase non configuré" }); return; }
    const { data } = await supabase.auth.getSession();
    if (data?.session) { set({ session: data.session, error: null }); await get().loadProfile(); }
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session });
      if (session) await get().loadProfile(); else set({ profile: null, role: null });
    });
  },

  loadProfile: async () => {
    if (DEMO) { set({ profile: { email: "demo@core.local", username: "demo" }, role: "manager" }); return; }
    const supabase = getSupabase();
    const user = get().session?.user;
    if (!supabase || !user) return;
    const { data, error } = await supabase.from("profiles").select("email, username, role").eq("id", user.id).maybeSingle();
    if (error) { console.warn("[CORE] loadProfile warning:", error.message); set({ profile: { email: user.email }, role: null }); return; }
    set({ profile: data || { email: user.email }, role: data?.role || null });
  },

  signIn: async ({ identifier, password, remember }) => {
    set({ loading: true, error: null });
    try {
      if (DEMO) {
        if (!password || password.length < 3) throw new Error("Password troppo corta");
        const demoSession = { user: { id: "demo", email: `${identifier || "demo"}@core.local` } };
        set({ session: demoSession }); await get().loadProfile(); return { ok: true };
      }
      const supabase = getSupabase();
      if (!supabase) throw new Error(getSupabaseInitError() || "Supabase non configuré");
      let email = identifier;
      if (LOGIN_MODE === "username" && identifier && !String(identifier).includes("@")) {
        const { data, error } = await supabase.from("profiles").select("email").eq("username", identifier).maybeSingle();
        if (error || !data?.email) throw new Error("Username non valido");
        email = data.email;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message || "Login fallito");
      set({ session: data.session, error: null }); await get().loadProfile(); return { ok: true };
    } catch (e) {
      set({ error: e?.message || String(e) }); return { ok: false, error: e?.message || String(e) };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    if (DEMO) { set({ ...initial }); return; }
    const supabase = getSupabase(); if (supabase) await supabase.auth.signOut();
    set({ ...initial });
  },
}), { name: "core_auth_v822" }));
