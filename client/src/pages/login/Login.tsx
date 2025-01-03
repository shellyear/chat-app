import { useState } from 'react'

import LoginForm from './LoginForm'
import VerificationSubmit from './VerificationSubmit'

function Login() {
  const [verificationCodeSent, setVerificationCodeSent] = useState(false)

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
