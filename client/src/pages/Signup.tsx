import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'

import { SendCredentialsForm } from '../components/common/SendCredentialsForm'
import { Wrapper } from './Login'
import { auth } from '../firebase'

const useSignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const sendCredentials = () => {
    createUserWithEmailAndPassword(auth, email, password)
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

export function Signup() {
  const signupFormData = useSignupForm()
  return (
    <Wrapper>
      <div>
        <h2 className="mb-3">Register to the chat app!</h2>
        <div className="mb-3">
          Already registered? <Link to="/login">Log in</Link>
        </div>
        <SendCredentialsForm {...signupFormData} />
      </div>
    </Wrapper>
  )
}
