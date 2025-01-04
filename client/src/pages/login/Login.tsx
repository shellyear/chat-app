import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import LoginForm from './LoginForm'
import VerificationSubmit from './VerificationSubmit'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const { user, loading } = useAuth()
  const [verificationCodeSent, setVerificationCodeSent] = useState(false)

  if (loading) {
    return null
  }

  if (user) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-md">
        {verificationCodeSent ? (
          <VerificationSubmit />
        ) : (
          <LoginForm setVerificationCodeSent={setVerificationCodeSent} />
        )}
      </div>
    </div>
  )
}

export default Login
