import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { Messages } from './components/chat/Messages'

const Wrapper = styled.div`
  height: 100vh;
`

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    display: none;
  }
`

function App() {
  return (
    <Wrapper>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route path=":targetId?" element={<Messages />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Wrapper>
  )
}

export default App
