import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'

const Wrapper = styled.div`
  height: 100vh;
`

function App() {
  return (
    <Wrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route index path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Wrapper>
  )
}

export default App
