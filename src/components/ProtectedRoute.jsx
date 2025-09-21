import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export default function ProtectedRoute({ children, allow = [] }) {
  const { session, profile, loading } = useAuthStore();
  if (loading) return null; // could show a spinner

  // If Supabase not configured, dev mode: allow everything
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return children;
  }

  if (!session) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(profile?.role)) return <Navigate to="/" replace />;
  return children;
}
