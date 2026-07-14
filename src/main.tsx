import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SkepticModeProvider } from './context/SkepticModeContext'
import { initGA4 } from './analytics/ga'
import './index.css'

initGA4()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SkepticModeProvider>
        <App />
      </SkepticModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// Dismiss preloader once React has hydrated
if (window.__dismissPreloader) {
  window.__dismissPreloader()
}
