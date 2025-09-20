import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
export const useAuthStore = create((set, get) => ({
  session: null, profile: null, lang: "it",
  setLang: (lang) => set({ lang }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  fetchProfile: async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return set({ profile: null });
    const { data, error } = await supabase.from("profiles").select("id, email, role").eq("id", user.id).maybeSingle();
    if (!error) set({ profile: data });
  },
}));
