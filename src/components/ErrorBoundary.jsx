// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Journalisation (console ou service externe type Sentry)
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Nettoyage léger du cache local (clés probables de l'app)
    try {
      const keys = Object.keys(localStorage || {});
      keys
        .filter((k) => k.startsWith("core_") || k.startsWith("sb-"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    // Rechargement propre
    location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Quelque chose s’est mal passé.</h1>
        <p style={{ marginBottom: 12 }}>
          L’application a rencontré une erreur inattendue. Vous pouvez essayer de recharger.
        </p>
        <button
          onClick={this.handleReset}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>

        {process.env.NODE_ENV !== "production" && this.state.error && (
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        )}
      </div>
    );
  }
}
