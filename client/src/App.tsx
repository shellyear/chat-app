import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './pages/ProtectedRoute'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AuthProvider from './contexts/AuthContext'
import WebsocketProvider from './contexts/WebsocketContext'
import ChatArea from './pages/dashboard/components/chatarea/ChatArea'
import MessagesProvider from './contexts/MessagesContext'

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
                <MessagesProvider>
                  <WebsocketProvider>
                    <Dashboard />
                  </WebsocketProvider>
                </MessagesProvider>
              </ProtectedRoute>
            }
          >
            <Route path=":id" element={<ChatArea />} />
            <Route path="" element={<ChatArea />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
