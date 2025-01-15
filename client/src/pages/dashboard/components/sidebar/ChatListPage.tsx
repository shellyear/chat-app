import { useEffect, useState } from 'react'
import { CiSearch } from 'react-icons/ci'
import { IoMdMenu } from 'react-icons/io'

import SidebarMenu from './SidebarMenu'
import { SidebarPage } from './Sidebar'
import { IChat } from '../../../../types/chat'
import API from '../../../../api'
import { useAuth } from '../../../../contexts/AuthContext'

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
            placeholder="Search"
            className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <CiSearch className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {isMenuOpen && <SidebarMenu openSidebarPage={openSidebarPage} />}
    </div>
  )
}

interface IChatListPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
  openChat: (chatId: string) => void
}

function ChatListPage({ openSidebarPage, openChat }: IChatListPageProps) {
  const { user } = useAuth()
  const [chats, setChats] = useState<IChat[]>([])

  const fetchChats = async () => {
    const { data, status } = await API.chat.getChats()
    if (status === 200) {
      setChats(data.data)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  return (
    <>
      <SearchBar openSidebarPage={openSidebarPage} />
      <div className="flex-grow overflow-y-auto">
        {chats.map((item, i) => (
          <div
            key={item._id}
            onClick={() => openChat(item._id)}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
            <div className="flex-grow">
              <h3 className="font-semibold">
                User {item.participantsIds.find((participant) => participant._id !== user._id).email}
              </h3>
              <p className="text-sm text-gray-500 truncate">Last message...</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ChatListPage
