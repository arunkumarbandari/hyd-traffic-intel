import { Navigate, Route, Routes } from 'react-router-dom'
import TopNav from './components/navigation/TopNav'
import HistoryPage from './pages/HistoryPage'
import IntelligencePage from './pages/IntelligencePage'
import LiveMapPage from './pages/LiveMapPage'

function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/live-map" replace />} />
        <Route path="/live-map" element={<LiveMapPage />} />
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/live-map" replace />} />
      </Routes>
    </>
  )
}

export default App
