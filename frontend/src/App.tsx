import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'

// Админ-панель тянет recharts — грузим её отдельным чанком только при переходе на /admin.
const AdminPage = lazy(() => import('./pages/AdminPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span
        className="size-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"
        aria-label="Загрузка"
      />
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
