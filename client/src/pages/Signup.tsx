import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'

import { SendCredentialsForm } from '../components/common/SendCredentialsForm'
import { Wrapper } from './Login'
import { auth, db } from '../firebase'

const useSignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const sendCredentials = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const userDocRef = doc(collection(db, 'users'), user.email)
      await setDoc(userDocRef, {
        id: user.uid,
        email: user.email,
        name: ''
      })
      navigate('/')
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // eslint-disable-next-line no-console
      console.warn({ errorCode, errorMessage })
    }
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
