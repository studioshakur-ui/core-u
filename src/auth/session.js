// src/auth/session.js
// Mini-auth côté client pour prototyper sans Supabase

const KEY = "core_session_v1"; // clé de stockage

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || !s.email || !s.role) return null;
    return s;
  } catch {
    return null;
  }
}

export function signIn({ email, role }) {
  const session = { email, role, ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  localStorage.removeItem(KEY);
}

export function getRole() {
  return getSession()?.role || null;
}

export function isLoggedIn() {
  return !!getSession();
}
