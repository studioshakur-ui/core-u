import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { hasAccess } from "../auth/roles";

export default function GuardedRoute({ children, requireRole }) {
  const { session, role, loading, setLastRequestedPath } = useAuthStore();
  const location = useLocation();
  useEffect(() => { if (!session) setLastRequestedPath(location.pathname + location.search); }, [session, location, setLastRequestedPath]);
  if (loading) return <div className="p-6 text-center">Caricamento…</div>;
  if (!session) return <Navigate to="/login" replace />;
  if (requireRole && !hasAccess(role, requireRole)) return <Navigate to="/" replace />;
  return children;
}
