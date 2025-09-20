import { create } from "zustand";
export const useAppStore = create((set,get)=> ({
  lang: "it",
  setLang: (lang)=> set({ lang }),
  session: null, profile: null, role: null,
  setSession: (session)=> set({ session }),
  setProfile: (profile)=> set({ profile, role: profile?.role || null }),
}));
