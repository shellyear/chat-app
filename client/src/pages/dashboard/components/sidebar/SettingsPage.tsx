import { IoMdArrowBack } from 'react-icons/io'
import { MdModeEdit, MdEmail } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useState } from 'react'

import { useAuth } from '../../../../contexts/AuthContext'
import { SidebarPage } from './Sidebar'

function LogoutMenu({ logout }: { logout: () => void }) {
  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <ul className="py-1" role="menu">
        <li onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Logout
        </li>
      </ul>
    </div>
  )
}

interface ISettingPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function SettingsPage({ openSidebarPage }: ISettingPageProps) {
  const { user, logout } = useAuth()
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  const handleGoBack = () => {
    openSidebarPage(SidebarPage.CHATLIST_PAGE)
  }

  const onThreeDotsClick = () => {
    setShowLogoutMenu((prev) => !prev)
  }

  const onEditClick = () => {
    openSidebarPage(SidebarPage.EDIT_SETTINGS_PAGE)
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
        <button type="button" className="p-2">
          <MdModeEdit onClick={() => onEditClick()} className="w-5 h-5" />
        </button>
        <button type="button" className="p-2" onClick={onThreeDotsClick}>
          <BsThreeDotsVertical className="w-5 h-5" />
        </button>
        {showLogoutMenu && <LogoutMenu logout={logout} />}
      </div>

      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-[7.5rem] h-[7.5rem] rounded-full bg-gray-300 mb-4">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full object-cover flex items-center justify-center text-3xl bg-red-300">
              <span>{user?.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}</span>
            </div>
          )}
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

export default SettingsPage
