import { Component } from 'react'
export default class ErrorBoundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err){ return { err } }
  componentDidCatch(err,info){ console.error('Boundary', err, info) }
  render(){
    if (this.state.err) {
      return (
        <div style={{minHeight:'100vh',background:'#000',color:'#fff',padding:20,fontFamily:'system-ui'}}>
          <h1>⚠️ Errore UI</h1>
          <p>{String(this.state.err.message || this.state.err)}</p>
          <a href="#/debug" style={{color:'#0ea5e9'}}>Apri debug</a>
        </div>
      )
    }
    return this.props.children
  }
}
