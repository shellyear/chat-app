import { useEffect, useState, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { IoChatbox } from 'react-icons/io5'
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js'

import { allowedCountries as countries } from '../../constants/countries'
import API from '../../api'

interface ILoginForm {
  userLocation: string
  setVerificationCodeSent: Dispatch<SetStateAction<boolean>>
}

export default function LoginForm({ userLocation, setVerificationCodeSent }: ILoginForm) {
  const [country, setCountry] = useState<(typeof countries)[0] | undefined>()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const foundCountry = countries.find((country) => userLocation.includes(country.code))
    setCountry(foundCountry)
    setPhoneNumber(foundCountry.phoneCode)
  }, [userLocation])

  useEffect(() => {
    if (country) {
      setPhoneNumber(country.phoneCode)
    }
  }, [country])

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (country && value.startsWith(country.phoneCode)) {
      setPhoneNumber(`${country.phoneCode} ${value.slice(country.phoneCode.length + ' '.length)}`)
    }

    if (error) setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (phoneNumber && country) {
      try {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber, country.code as CountryCode)
        if (parsedPhoneNumber.isValid()) {
          setLoading(true)
          const response = await API.auth.login(parsedPhoneNumber.number, keepSignedIn)
          if (response.status === 200) {
            setVerificationCodeSent(true)
          }
        } else {
          setError('Number is not valid')
        }
      } catch (error) {
        setError("Couldn't process the request, please try again")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full max-w-md">
        <div className="flex flex-col gap-6	justify-items-center items-center text-center mb-6">
          <IoChatbox size={62} />
          <h1 className="text-2xl font-bold text-gray-800">Chatogram</h1>
        </div>
        <p className="text-gray-600 text-center mb-6">Please confirm your country code and enter your phone number.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <button
              type="button"
              className="w-full text-left bg-gray-50 px-4 py-2 rounded-md flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {country && <span>{country.label}</span>}
              <FaChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
                {countries.map((country) => (
                  <li
                    key={country.label}
                    className="w-full px-4 py-2 hover:bg-gray-100 flex justify-between space-x-2"
                    onClick={() => {
                      setCountry(country)
                      setIsDropdownOpen(false)
                      setError('')
                    }}
                  >
                    <span>{country.flag}</span>
                    <span>{country.label}</span>
                    <span className="text-gray-500 text-right">{country.phoneCode}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="tel"
            required
            placeholder="Your phone number"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <label id="keepMeSignedIn" className="flex items-center space-x-2">
            <input
              id="keepMeSignedIn"
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
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
      </div>
    </div>
  )
}
