import { useNavigate } from 'react-router-dom'
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react'
import { MdOutlineAddAPhoto } from 'react-icons/md'
import { FaArrowRight } from 'react-icons/fa6'
import { IoMdArrowBack } from 'react-icons/io'

import { useAuth } from '../../contexts/AuthContext'
import TopLabelInput from '../../components/TopLabelInput'
import API from '../../api'
import { StepPageEnum } from './Login'

interface ISetupAccountProps {
  setStep: Dispatch<SetStateAction<number>>
}

function SetupAccount({ setStep }: ISetupAccountProps) {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [profilePicture, setProfilePicture] = useState<File>()

  const email = sessionStorage.getItem('email')
  const keepMeSignedIn = JSON.parse(sessionStorage.getItem('keepMeSignedIn')) || true

  const handleImgInputClick = () => {
    inputRef.current.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setProfilePicture(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const data = await API.auth.setupAccount({ email, name, surname, profilePicture, keepMeSignedIn })
      setUser(data.user)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error while setting up an account')
    }
  }

  if (!email) {
    navigate('/login')
  }

  return (
    <div>
      <div className="w-full flex flex-col items-center">
        <div
          className="relative w-[7.5rem] h-[7.5rem] rounded-full bg-blue-400 mb-4 cursor-pointer"
          onClick={handleImgInputClick}
        >
          {profilePicture && (
            <img
              src={profilePicture && URL.createObjectURL(profilePicture)}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover filter brightness-[0.8]"
            />
          )}
          <MdOutlineAddAPhoto
            className="absolute w-12 h-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition duration-300 hover:scale-110"
            color="white"
          />
          <input type="file" ref={inputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <h3 className="font-semibold text-base">Profile info</h3>
        <p className="mt-2 text-sm text-gray-500">Enter your name and add a profile photo.</p>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <TopLabelInput
          name="Name"
          label="Name (required)"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          minLength={1}
          maxLength={100}
        />
        <TopLabelInput
          name="Last Name"
          label="Last Name"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          minLength={1}
          maxLength={100}
        />
      </div>
      {name && email && (
        <div
          className="absolute bottom-6 right-12 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-400"
          onClick={handleSubmit}
        >
          <FaArrowRight className="w-4 h-12" color="white" />
        </div>
      )}
      <IoMdArrowBack
        className="absolute top-6 left-12 w-10 h-10 cursor-pointer"
        color="black"
        onClick={() => setStep(StepPageEnum.LOGIN_FORM_PAGE)}
      />
    </div>
  )
}

export default SetupAccount
