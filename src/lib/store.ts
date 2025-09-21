import { create } from 'zustand'
type State = { q: string; role: 'all'|'capo'|'operaio'; showUnassigned: boolean; setQ:(q:string)=>void; setRole:(r:State['role'])=>void; setUnassigned:(b:boolean)=>void }
export const useFilters = create<State>((set)=> ({ q:'', role:'all', showUnassigned:false, setQ:(q)=>set({q}), setRole:(r)=>set({role:r}), setUnassigned:(b)=>set({showUnassigned:b}) }))