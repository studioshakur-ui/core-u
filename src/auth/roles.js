export const ROLES = {
  DIREZIONE: "direzione",
  MANAGER: "manager",
  CAPO: "capo",
  USER: "user",
};
export function readRole(session){
  return session?.user?.app_metadata?.role || session?.user?.user_metadata?.role || null;
}
