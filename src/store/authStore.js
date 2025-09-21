import { create } from "zustand";
import { supabase } from "../lib/supabaseClient.js";

export const useAuthStore = create((set, get) => ({
  loading: true,
  session: null,
  profile: null,

  init: async () => {
    // Dev mode: if no Supabase, mock a session manager
    if (!supabase) {
      set({ session: { dev: true }, profile: { role: "manager", email: "dev@local" }, loading: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });
    if (data.session) get().loadProfile(data.session);
    supabase.auth.onAuthStateChange((_e, s) => {
      set({ session: s });
      if (s) get().loadProfile(s);
      else set({ profile: null });
    });
  },

  loadProfile: async (session) => {
    // role from app_metadata or default manager
    const role = session?.user?.app_metadata?.role || "manager";
    set({ profile: { role, email: session?.user?.email ?? "" } });
  },

  signIn: async (email, password) => {
    if (!supabase) {
      set({ session: { dev: true }, profile: { role: "manager", email: email || "dev@local" } });
      return { error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    set({ session: data.session });
    if (data.session) get().loadProfile(data.session);
    return { error: null };
  },

  signOut: async () => {
    if (!supabase) {
      set({ session: null, profile: null });
      return;
    }
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },
}));

// auto-init in module scope
useAuthStore.getState().init();
