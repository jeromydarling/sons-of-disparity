import { createContext, useContext, useState, type ReactNode } from 'react'

interface SkepticModeContextType {
  skepticMode: boolean
  toggleSkepticMode: () => void
}

const SkepticModeContext = createContext<SkepticModeContextType>({
  skepticMode: false,
  toggleSkepticMode: () => {},
})

export function SkepticModeProvider({ children }: { children: ReactNode }) {
  const [skepticMode, setSkepticMode] = useState(false)
  const toggleSkepticMode = () => setSkepticMode(prev => !prev)
  return (
    <SkepticModeContext.Provider value={{ skepticMode, toggleSkepticMode }}>
      {children}
    </SkepticModeContext.Provider>
  )
}

export const useSkepticMode = () => useContext(SkepticModeContext)
