const H_DEFAULT = 8;
const COSTO_DEFAULT = Number(import.meta.env.VITE_CORE_COSTO_ORARIO_DEFAULT ?? 22);

export function computeKpis({ membersCount = 0, assignments = [], oreGiornaliere = H_DEFAULT, costoOrario = COSTO_DEFAULT } = {}) {
  const capacity = Math.max(0, Number(membersCount) || 0) * Math.max(1, Number(oreGiornaliere) || H_DEFAULT);
  const assigned = assignments.reduce((acc, a) => acc + (Number(a.hours) || 0), 0);
  const unassigned = Math.max(0, capacity - assigned);
  const coverage = capacity > 0 ? (assigned / capacity) : 0;
  const cost = assigned * (Number(costoOrario) || COSTO_DEFAULT);

  return {
    capacity, assigned, unassigned,
    coverage, // 0..1
    cost,
  };
}

export function delta(current, previous) {
  const keys = ["capacity","assigned","unassigned","coverage","cost"];
  const d = {};
  for (const k of keys) {
    d[k] = (current?.[k] ?? 0) - (previous?.[k] ?? 0);
  }
  return d;
}
