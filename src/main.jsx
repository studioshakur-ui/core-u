import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/* Nettoie les tokens Supabase éventuels dans l’URL après magic link */
(function () {
  if (typeof window === 'undefined') return;
  const h = window.location.hash || '';
  if (h.includes('access_token=') || h.includes('refresh_token=')) {
    window.history.replaceState({}, document.title, window.location.origin + '/#/');
  }
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

/* Signale au watchdog que React a bien monté */
if (typeof window !== 'undefined' && typeof window.__react_mounted__ === 'function') {
  window.__react_mounted__();
}
