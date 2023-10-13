import styled from 'styled-components'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { SendCredentialsForm } from '../components/common/SendCredentialsForm'
import { auth } from '../firebase'

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const sendCredentials = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    sendCredentials
  }
}

function LoginForm() {
  const loginFormData = useLoginForm()
  return <SendCredentialsForm {...loginFormData} />
}

export function Login() {
  return (
    <Wrapper>
      <div>
        <h2 className="mb-3">Welcome to chat app!</h2>
        <div className="mb-3">
          Not registered yet? <Link to="/signup">Sign up</Link>
        </div>
        <LoginForm />
      </div>
    </Wrapper>
  )
}
