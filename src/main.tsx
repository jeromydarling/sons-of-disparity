import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SkepticModeProvider } from './context/SkepticModeContext'
import { initGA4 } from './analytics/ga'
import { usePreloader } from './hooks/usePreloader'
import './index.css'

initGA4()

function Root() {
  // Holds the index.html preloader until min(2200ms, critical data), whichever
  // is later — see src/hooks/usePreloader.ts.
  usePreloader()
  return (
    <BrowserRouter>
      <SkepticModeProvider>
        <App />
      </SkepticModeProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
