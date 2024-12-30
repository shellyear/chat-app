'use client'

import { useState } from 'react'

export default function Login() {
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const countries = [
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' }
    // Add more countries as needed
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Telegram</h1>
        </div>
        <p className="text-gray-600 text-center mb-6">Please confirm your country code and enter your phone number.</p>
        <form className="space-y-4">
          <div className="relative">
            <button
              type="button"
              className="w-full text-left bg-gray-50 px-4 py-2 rounded-md flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{countryCode}</span>
              {/* <ChevronDown className="h-5 w-5 text-gray-400" /> */}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => {
                      setCountryCode(country.code)
                      setIsDropdownOpen(false)
                    }}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-gray-500">{country.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="tel"
            placeholder="Your phone number"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Continue
          </button>
          <button
            type="button"
            className="w-full text-blue-500 py-2 rounded-md hover:bg-blue-50 transition duration-300"
          >
            Pokračovat v Češtině
          </button>
        </form>
      </div>
    </div>
  )
}
