import { create } from "zustand";
import { produce } from "immer";

const initial = {
  lang: "fr",
  session: null,
  profile: null,
  role: "manager",
  week: 34,
  days: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
  activeDay: 0,
  cloud: [],
  teams: {},
  anomalies: [],
  validCount: 0,
  totalHours: 0,
};

export const useAppStore = create((set,get)=> ({
  ...initial,
  setLang: (lang)=> set({ lang }),
  setWeek: (week)=> set({ week }),
  setActiveDay: (i)=> set({ activeDay: i }),
  resetPlanning: ()=> set({ cloud: [], teams: {}, anomalies: [], validCount: 0, totalHours: 0 }),
  loadFromImport: (payload)=> set(state => ({ ...state, ...payload })),
  addTeam: (capo)=> set(produce(state=>{ state.teams[capo.id] = { capo, members: [] }; })),
  dropToTeam: (capoId, operaio)=> set(produce(state=>{
    state.cloud = state.cloud.filter(p=>p.id!==operaio.id);
    Object.values(state.teams).forEach(t=>{ t.members = t.members.filter(m=>m.id!==operaio.id); });
    if(!state.teams[capoId]) state.teams[capoId] = { capo: {id:capoId, name:"Capo"}, members: [] };
    state.teams[capoId].members.push(operaio);
  })),
}));
