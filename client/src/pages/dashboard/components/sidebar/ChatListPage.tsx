import { useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoMdMenu } from 'react-icons/io'

import SidebarMenu from './SidebarMenu'
import { SidebarPage } from './Sidebar'

function SearchBar({ openSidebarPage }: { openSidebarPage: (pageName: SidebarPage) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative p-4 flex items-center border-b border-gray-200">
      <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
        <IoMdMenu onClick={() => toggleMenu()} className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex-grow ml-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats"
            className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <CiSearch className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isMenuOpen && <SidebarMenu openSidebarPage={openSidebarPage} />}
    </div>
  )
}

function ChatListPage({ openSidebarPage }: { openSidebarPage: (pageName: SidebarPage) => void }) {
  return (
    <>
      <SearchBar openSidebarPage={openSidebarPage} />
      <div className="flex-grow overflow-y-auto">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
            <div className="flex-grow">
              <h3 className="font-semibold">User {item}</h3>
              <p className="text-sm text-gray-500 truncate">Last message...</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ChatListPage
