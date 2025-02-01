import { IoMdArrowBack } from 'react-icons/io'
import { MdOutlineAddAPhoto } from 'react-icons/md'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'

import { SidebarPage } from './Sidebar'
import { useAuth } from '../../../../contexts/AuthContext'
import TopLabelInput from '../../../../components/TopLabelInput'
import API from '../../../../api'

interface IEditSettingPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function EditSettingsPage({ openSidebarPage }: IEditSettingPageProps) {
  const { user, setUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user.name || '')
  const [surname, setSurname] = useState(user.surname || '')
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState(user.uniqueName || '')

  const [profilePicture, setProfilePicture] = useState<File>()
  const [showSaveButton, setShowSaveButton] = useState(false)

  useEffect(() => {
    const isValidUsername = /^[a-zA-Z0-9_]{5,34}$/.test(username)
    if (
      username !== (user.uniqueName || '') ||
      name !== (user.name || '') ||
      surname !== (user.surname || '') ||
      bio !== (user.bio || '') ||
      profilePicture
    ) {
      if (username && !isValidUsername) {
        return setShowSaveButton(false)
      }
      return setShowSaveButton(true)
    }
    setShowSaveButton(false)
  }, [name, surname, bio, username, profilePicture, user.uniqueName, user.name, user.bio, user.surname])

  const handleGoBack = () => {
    openSidebarPage(SidebarPage.SETTINGS_PAGE)
  }

  const handleImageInputClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    if (file) {
      setProfilePicture(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await API.user.setProfileInfo(user.userId, {
        name,
        surname,
        uniqueName: username,
        bio,
        profilePicture
      })
      setUser(response.data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while setting profile data', error)
    }
  }

  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-3">
        <button type="button" onClick={handleGoBack}>
          <IoMdArrowBack className="w-6 h-6 text-gray-500" />
        </button>
        <div className="flex-1 pl-8 text-xl font-semibold">
          <span className="i18n">Edit Profile</span>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="relative w-[7.5rem] h-[7.5rem] rounded-full bg-gray-300 mb-4" onClick={handleImageInputClick}>
            {profilePicture || user.profilePicture ? (
              <img
                src={(profilePicture && URL.createObjectURL(profilePicture)) || user.profilePicture}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover filter brightness-[0.8]"
              />
            ) : (
              <div className="w-full h-full rounded-full object-cover flex items-center justify-center text-3xl bg-red-300 filter brightness-[0.8]    ">
                <span>{user?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <MdOutlineAddAPhoto
              className="absolute w-12 h-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition duration-300 hover:scale-110"
              color="white"
            />
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          <h3 className="text-xl font-semibold">{user?.name}</h3>
        </div>

        <div className="flex flex-col">
          <ul className="flex flex-col gap-4 px-6">
            <li>
              <TopLabelInput type="text" name="name" label="Name" onChange={(e) => setName(e.target.value)} />
            </li>
            <li>
              <TopLabelInput
                type="text"
                name="surname"
                label="Last Name"
                onChange={(e) => setSurname(e.target.value)}
              />
            </li>
            <li>
              <TopLabelInput type="text" name="Bio" label="Bio (optional)" onChange={(e) => setBio(e.target.value)} />
            </li>
          </ul>
          <div className="bg-gray-100 pt-2 pb-3">
            <p className="px-6 text-gray-500 text-sm leading-tight">
              Any details such as age, occupation or city.
              <br /> Example: 23 y.o designer from San Francisco
            </p>
          </div>
          <div className="mt-4 px-6">
            <div className="text-blue-500 font-semibold">Username</div>
            <div className="mt-4">
              <TopLabelInput
                type="text"
                name="Username"
                label="Username (optional)"
                pattern="^[a-z0-9_]{5,}$"
                minLength={5}
                maxLength={34}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-gray-100 pt-2 pb-3 text-sm text-gray-500 px-6 leading-tight">
            <p>
              You can choose a username on <span className="font-semibold">Chatogram</span>. If you do, people will be
              able to find you by this username and contact you without needing your email.
            </p>
            <p className="pt-2">
              You can use <span className="font-semibold">a-z, 0-9</span> and underscores. Minimum length is{' '}
              <span className="font-semibold">5</span> characters
            </p>
          </div>
        </div>
      </div>
      {showSaveButton && (
        <div
          className="absolute bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
        >
          <FaCheck className="w-4 h-4" color="white" />
        </div>
      )}
    </div>
  )
}

export default EditSettingsPage
