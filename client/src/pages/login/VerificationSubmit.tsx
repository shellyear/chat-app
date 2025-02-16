import { useState, FormEvent, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'

import API from '../../api'
import { useAuth } from '../../contexts/AuthContext'
import { StepPageEnum } from './Login'

interface IVerificationSubmitProps {
  setStep: Dispatch<SetStateAction<number>>
}

function VerificationSubmit({ setStep }: IVerificationSubmitProps) {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = sessionStorage.getItem('email')
    const keepMeSignedIn: boolean = JSON.parse(sessionStorage.getItem('keepMeSignedIn'))

    try {
      const response = await API.auth.verifyCode(email, code, keepMeSignedIn)

      if (response.code === 'SET_ACCOUNT_INFO') {
        setStep(StepPageEnum.SETUP_ACCOUNT_PAGE)
      }

      if (response.code === 'VERIFICATION_SUCCESS') {
        setUser(response.user)

        if (!keepMeSignedIn) {
          sessionStorage.setItem('sessionId', response.sessionId)
        }
        sessionStorage.removeItem('email')

        navigate('/')
      }
    } catch (error) {
      setError('Error while attempting to verify code')
    }
  }

  return (
    <div>
      <div className="w-full flex justify-center">
        <img src="/cat.gif" alt="cat GIF" className="w-56 h-56" />
      </div>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input
          type="number"
          required
          placeholder="Type your verification code"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Verify
        </button>
        {error && <div className="mt-2 text-red-400 text-center">{error}</div>}
      </form>
    </div>
  )
}

export default VerificationSubmit
