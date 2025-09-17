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
    console.error("[ErrorBoundary]", error, info);
  }
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    location.hash = "/"; 
    location.reload();
  };
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl">
          <h2 className="text-2xl font-semibold text-center">Qualcosa è andato storto.</h2>
          <p className="mt-2 text-white/70 text-sm break-words text-center">
            {this.state.error?.message || "Errore sconosciuto."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button className="btn btn-primary" onClick={this.handleReset}>Ricarica</button>
            <button className="btn btn-ghost" onClick={() => history.back()}>Indietro</button>
          </div>
          <p className="mt-3 text-xs text-white/50 text-center">Se persiste, contatta il supporto CORE.</p>
        </div>
      </div>
    );
  }
}
