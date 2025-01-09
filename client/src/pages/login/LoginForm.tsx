import { useState, FormEvent, Dispatch, SetStateAction } from 'react'
import { IoChatbox } from 'react-icons/io5'

import API from '../../api'

interface ILoginForm {
  setVerificationCodeSent: Dispatch<SetStateAction<boolean>>
}

export default function LoginForm({ setVerificationCodeSent }: ILoginForm) {
  const [email, setEmail] = useState('')
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await API.auth.login(email, keepMeSignedIn)
      if (response.status === 200) {
        sessionStorage.setItem('email', email)
        sessionStorage.setItem('keepMeSignedIn', keepMeSignedIn.toString())
        setVerificationCodeSent(true)
      } else {
        setError('Number is not valid')
      }
    } catch (error) {
      setError("Couldn't process the request, please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6	justify-items-center items-center text-center mb-6">
        <IoChatbox size={62} />
        <h1 className="text-2xl font-bold text-gray-800">Chatogram</h1>
      </div>
      <p className="text-gray-600 text-center mb-6">Please confirm your email adress to get verification code</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="Your email address"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label id="keepMeSignedIn" className="flex items-center space-x-2">
          <input
            id="keepMeSignedIn"
            type="checkbox"
            checked={keepMeSignedIn}
            onChange={(e) => setKeepMeSignedIn(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="text-gray-700">Keep me signed in</span>
        </label>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Continue
        </button>
      </form>
    </>
  )
}
