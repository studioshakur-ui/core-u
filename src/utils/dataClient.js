import { getSupabase } from "../lib/supabaseClient";
export const DEMO = (import.meta.env?.VITE_DEMO_MODE === "true");
export async function fetchTeams({ q = "", page = 1, pageSize = 10 } = {}) {
  const supabase = getSupabase();
  if (!supabase || DEMO) {
    const all = Array.from({ length: 28 }).map((_, i) => ({ id: i + 1, name: `Team ${i + 1}`, capo: `Capo ${i + 1}`, members: 6 + (i % 4) }));
    const filtered = q ? all.filter(t => (t.name + t.capo).toLowerCase().includes(q.toLowerCase())) : all;
    const start = (page - 1) * pageSize, end = start + pageSize;
    return { rows: filtered.slice(start, end), total: filtered.length };
  }
  let query = supabase.from("teams").select("id,name,capo:leader, members:members_count", { count: "exact" });
  if (q) query = query.ilike("name", `%${q}%`);
  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);
  if (error) throw error;
  return { rows: data || [], total: count || 0 };
}
export async function fetchDashboard() {
  const supabase = getSupabase();
  if (!supabase || DEMO) {
    return { kpis: [{ label: "Cavi posati", value: 12450, delta: 5.6 }, { label: "Linee completate", value: 312, delta: 2.1 }, { label: "Anomalie aperte", value: 7, delta: -22.0 }], spark: [12,14,13,16,18,17,20,19,23,22,26,24] };
  }
  const { data: lines } = await supabase.rpc("core_lines_completed");
  return { kpis: [{ label: "Cavi posati", value: lines?.cables || 0, delta: 0 }, { label: "Linee completate", value: lines?.completed || 0, delta: 0 }, { label: "Anomalie aperte", value: lines?.issues || 0, delta: 0 }], spark: lines?.spark || [1,2,3] };
}
export async function fetchAssignments() {
  const supabase = getSupabase();
  if (!supabase || DEMO) {
    return [{ id: 1, activity: "Cablaggio quadro A", qty: 12, note: "Ponte 3" }, { id: 2, activity: "Passacavi sezione B", qty: 30, note: "" }, { id: 3, activity: "Crimpaggio RJ45", qty: 50, note: "Urgente" }];
  }
  const { data, error } = await supabase.from("assignments").select("id, activity, qty, note").limit(1000);
  if (error) throw error;
  return data || [];
}
export async function saveAssignment(row) {
  const supabase = getSupabase();
  if (!supabase || DEMO) return { ok: true, demo: true };
  const { data, error } = await supabase.from("assignments").upsert(row).select().maybeSingle();
  if (error) return { ok: false, error: error.message };
  return { ok: true, data };
}