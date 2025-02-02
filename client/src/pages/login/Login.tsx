import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import LoginForm from './LoginForm'
import VerificationSubmit from './VerificationSubmit'
import { useAuth } from '../../contexts/AuthContext'
import SetupAccount from './SetupAccount'

export enum StepPageEnum {
  LOGIN_FORM_PAGE = 1,
  VERIFICATION_PAGE = 2,
  SETUP_ACCOUNT_PAGE = 3
}

function Login() {
  const { user, loading } = useAuth()
  const [step, setStep] = useState(StepPageEnum.LOGIN_FORM_PAGE)

  if (loading) {
    return null
  }

  if (user) {
    return <Navigate to="/" />
  }

  const showStepComponent = (step: number) => {
    if (step === 1) {
      return <LoginForm setStep={setStep} />
    }
    if (step === 2) {
      return <VerificationSubmit setStep={setStep} />
    }
    if (step === 3) {
      return <SetupAccount setStep={setStep} />
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-md">{showStepComponent(step)}</div>
    </div>
  )
}

export default Login
