// src/store/useCoreStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initial = {
  session: { user: null, role: null, email: null },
  offline: !navigator.onLine,
  toasts: [],
  undo: [],
  redo: [],
  rapportino: { status: "bozza", rows: [] }, // usato da Capo
};

export const useCoreStore = create(persist((set, get) => ({
  ...initial,

  setSession(payload){ set({ session: { ...get().session, ...payload } }); },

  setOffline(v){ set({ offline: v }); },

  pushToast(t){ const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { id, ...t }] });
    setTimeout(() => { get().dismissToast(id); }, t.duration ?? 3000);
  },
  dismissToast(id){ set({ toasts: get().toasts.filter(x => x.id !== id) }); },

  // Undo/Redo generici su rapportino.rows
  commitRows(next){
    const prev = get().rapportino.rows;
    set({ undo: [...get().undo, prev], redo: [], rapportino:{ ...get().rapportino, rows: next } });
  },
  undoOnce(){
    const u = [...get().undo];
    if (!u.length) return;
    const prev = u.pop();
    set({ undo: u, redo: [...get().redo, get().rapportino.rows],
      rapportino: { ...get().rapportino, rows: prev } });
  },
  redoOnce(){
    const r = [...get().redo];
    if (!r.length) return;
    const next = r.pop();
    set({ redo: r, undo: [...get().undo, get().rapportino.rows],
      rapportino: { ...get().rapportino, rows: next } });
  },

  setStatus(s){ set({ rapportino: { ...get().rapportino, status: s } }); },
}), { name: "core_v5_store", version: 2 }));

// Migrazioni (se in futuro cambierà la forma del dato)
