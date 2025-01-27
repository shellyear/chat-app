import { IoMdArrowBack } from 'react-icons/io'
import { MdEmail, MdOutlineAddAPhoto } from 'react-icons/md'
import { useState } from 'react'

import { SidebarPage } from './Sidebar'
import { useAuth } from '../../../../contexts/AuthContext'

interface IEditSettingPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function EditSettingsPage({ openSidebarPage }: IEditSettingPageProps) {
  const { user } = useAuth()

  const [name, setName] = useState(user.name || '')
  const [surname, setSurname] = useState(user.surname || '')
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState('')

  const handleGoBack = () => {
    openSidebarPage(SidebarPage.SETTINGS_PAGE)
  }

  return (
    <div>
      <div className="relative flex items-center justify-between p-3">
        <button type="button" onClick={handleGoBack}>
          <IoMdArrowBack className="w-5 h-5" />
        </button>
        <div className="flex-1 pl-4 text-lg font-bold">
          <span className="i18n">Settings</span>
        </div>
      </div>

      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative w-28 h-28 rounded-full bg-gray-300 mb-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
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
        </div>
        <h3 className="text-xl font-semibold">{user?.name}</h3>
        <p className="text-sm text-gray-500">online or not</p>
      </div>

      <div className="flex flex-col">
        <ul className="px-6">
          <li className="flex items-center gap-6">
            <MdEmail className="w-5 h-5" />
            <p>{user.email}</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EditSettingsPage
