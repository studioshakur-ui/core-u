// RBAC minimal
const matrix = {
  capo: ["/capo"],
  manager: ["/manager", "/capo"],
  direzione: ["/direzione", "/manager", "/capo"],
  admin: ["/admin", "/direzione", "/manager", "/capo"],
};

export function hasAccess(role, requireRole) {
  if (!requireRole) return true;
  if (!role) return false;
  if (role === "admin") return true;
  const list = matrix[role] || [];
  return list.some(p => p.includes(String(requireRole).replace("/", "")));
}
