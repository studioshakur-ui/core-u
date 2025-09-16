import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
(function () {
  if (typeof window === 'undefined') return;
  const h = window.location.hash || '';
  if (h.includes('access_token=') || h.includes('refresh_token=')) {
    window.history.replaceState({}, document.title, window.location.origin + '/#/');
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
