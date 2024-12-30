import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './pages/ProtectedRoute'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/" element={<Dashboard />}>
            <Route path=":targetId?" element={<Messages />} />
          </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
