import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoginForm from './LoginForm'
import VerificationSubmit from './VerificationSubmit'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [verificationCodeSent, setVerificationCodeSent] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

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
