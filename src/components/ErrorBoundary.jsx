import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={ hasError:false, error:null }; }
  static getDerivedStateFromError(error){ return { hasError:true, error }; }
  componentDidCatch(error, info){ console.error("[ErrorBoundary]", error, info); }
  handleReset = () => {
    this.setState({ hasError:false, error:null });
    try {
      const keys = Object.keys(localStorage || {});
      keys.filter(k => k.startsWith("core_") || k.startsWith("sb-")).forEach(k => localStorage.removeItem(k));
    } catch {}
    location.reload();
  };
  render(){
    if(!this.state.hasError) return this.props.children;
    return (
      <div style={{ padding:24 }}>
        <h1>Qualcosa è andato storto.</h1>
        <p>Prova a ricaricare l’applicazione.</p>
        <button onClick={this.handleReset}>Riprova</button>
        {process.env.NODE_ENV!=="production" && this.state.error &&
          <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error?.stack||this.state.error)}</pre>}
      </div>
    );
  }
}
