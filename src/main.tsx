import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/index.css'
import { App } from './App'
import { ToastProvider } from '@/components/Toast'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ToastProvider><App /></ToastProvider></React.StrictMode>)