// src/lib/routeUtils.js
export function getHomeRoute(role) {
  if (role === "direzione") return "/direzione";
  if (role === "manager") return "/manager";
  return "/capo";
}
