import ErrorBoundary from './components/ErrorBoundary.jsx'
// src/main.jsx
import React from 'react'

// ...
root.render(
  <React.StrictMode>
    <HashRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HashRouter>
  </React.StrictMode>
)
