import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { supabase } from "./lib/supabaseClient";
import { ToastProvider } from "./components/Toast.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Nettoyage de l’URL après auth
const cleanupUrl = () => {
  const h = window.location.hash || "";
  if (h.includes("access_token=") || h.includes("refresh_token=") || h.includes("type=")) {
    window.history.replaceState({}, document.title, window.location.origin + "/#/");
  }
};
supabase.auth.getSession().then(({ data:{ session } }) => { if (session) cleanupUrl(); });
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") cleanupUrl();
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
);
