import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import AmbientAudio from './components/AmbientAudio'

const HomePage    = lazy(() => import('./pages/HomePage'))
const StoryPage   = lazy(() => import('./pages/StoryPage'))
const WatchPage   = lazy(() => import('./pages/WatchPage'))
const DataPage    = lazy(() => import('./pages/DataPage'))
const SkepticPage = lazy(() => import('./pages/SkepticPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const RecordPage  = lazy(() => import('./pages/RecordPage'))
const AboutPage   = lazy(() => import('./pages/AboutPage'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <AmbientAudio />
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/story"  element={<StoryPage />} />
        <Route path="/watch"  element={<WatchPage />} />
        <Route path="/data"   element={<DataPage />} />
        <Route path="/skeptic" element={<SkepticPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/record"  element={<RecordPage />} />
        <Route path="/about"   element={<AboutPage />} />
      </Routes>
    </Suspense>
  )
}
