import { create } from "zustand";

const initial = {
  lang: "it",
  week: 34,
  days: ["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],
  activeDay: 0
};

export const useAppStore = create((set) => ({
  ...initial,
  setLang: (lang) => set({ lang })
}));
