import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './pages/ProtectedRoute'
import Login from './pages/login/Login'
import Dashboard from './pages/Dashboard'
import AuthProvider from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
