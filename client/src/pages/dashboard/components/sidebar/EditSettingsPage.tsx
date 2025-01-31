import { IoMdArrowBack } from 'react-icons/io'
import { MdEmail, MdOutlineAddAPhoto } from 'react-icons/md'
import { useState } from 'react'

import { SidebarPage } from './Sidebar'
import { useAuth } from '../../../../contexts/AuthContext'
import TopLabelInput from '../../../../components/TopLabelInput'

interface IEditSettingPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function EditSettingsPage({ openSidebarPage }: IEditSettingPageProps) {
  const { user } = useAuth()

  const [name, setName] = useState(user.name || '')
  const [surname, setSurname] = useState(user.surname || '')
  const [bio, setBio] = useState(user.bio || '')
  const [username, setUsername] = useState(user.uniqueName || '')

  const handleGoBack = () => {
    openSidebarPage(SidebarPage.SETTINGS_PAGE)
  }

  return (
    <div className="max-h-full">
      <div className="relative flex items-center justify-between p-3">
        <button type="button" onClick={handleGoBack}>
          <IoMdArrowBack className="w-5 h-5" />
        </button>
        <div className="flex-1 pl-4 text-lg font-bold">
          <span className="i18n">Edit profile</span>
        </div>
      </div>

      <div className="overflow-y-auto h-full">
        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="relative w-[7.5rem] h-[7.5rem] rounded-full bg-gray-300 mb-4">
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
        </div>

        <div className="flex flex-col">
          <ul className="flex flex-col gap-4 px-6">
            <li>
              <TopLabelInput name="name" label="Name" />
            </li>
            <li>
              <TopLabelInput name="surname" label="Last Name" />
            </li>
            <li>
              <TopLabelInput name="Bio" label="Bio (optional)" />
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
              <TopLabelInput name="Username" label="Username (optional)" />
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
    </div>
  )
}

export default EditSettingsPage
