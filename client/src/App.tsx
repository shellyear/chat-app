import { BrowserRouter, Route, Routes } from 'react-router-dom'

// import { ProtectedRoute } from './pages/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AuthProvider from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route path=":targetId?" element={<Messages />} />
            </Route>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
