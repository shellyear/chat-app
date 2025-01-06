import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './pages/ProtectedRoute'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AuthProvider from './contexts/AuthContext'
import WebsocketProvider from './contexts/WebsocketContext'

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
                <WebsocketProvider>
                  <Dashboard />
                </WebsocketProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
