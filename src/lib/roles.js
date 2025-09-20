export const VALID_ROLES = ["capo", "manager", "direzione"];
export function normalizeRole(r){ return (r ?? "").toString().trim().toLowerCase(); }
export function isValidRole(r){ return VALID_ROLES.includes(normalizeRole(r)); }
export function pathForRole(r){ const role = normalizeRole(r); if(role==="direzione") return "/direzione"; if(role==="manager") return "/manager"; return "/capo"; }
