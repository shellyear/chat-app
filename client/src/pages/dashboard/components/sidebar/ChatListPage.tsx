import { ChangeEvent, useEffect, useState } from 'react'
import { CiSearch, CiBookmark } from 'react-icons/ci'
import { IoMdMenu } from 'react-icons/io'
import { debounce } from 'lodash'

import SidebarMenu from './SidebarMenu'
import { SidebarPage } from './Sidebar'
import { IChat } from '../../../../types/chat'
import API from '../../../../api'
import { useAuth } from '../../../../contexts/AuthContext'
import useSearchBar from '../../hooks/useSearchBar'
import { IUser } from '../../../../types/user'

interface ISearchBar {
  openSidebarPage: (pageName: SidebarPage) => void
  searchQuery: string
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
}

function SearchBar({ openSidebarPage, searchQuery, handleSearch }: ISearchBar) {
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
            value={searchQuery}
            onChange={handleSearch}
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
  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useSearchBar<IUser>()

  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim() === '' || query.trim().length < 3) {
      setSearchResults([])
      return
    }

    try {
      const { data } = await API.search.searchUsers(query)
      setSearchResults(data.data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search error:', error)
    }
  }, 300)

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchQuery(value)
    debouncedSearch(value)
  }

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
      <SearchBar openSidebarPage={openSidebarPage} searchQuery={searchQuery} handleSearch={handleSearch} />
      <div className="flex-grow overflow-y-auto">
        {searchResults.length > 0
          ? searchResults.map((foundUser) =>
              foundUser.email === user.email ? (
                <div
                  key={user.email}
                  onClick={() => openChat(user._id)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="box-border flex items-center justify-center w-12 h-12 rounded-full bg-blue-400 mr-4">
                    <CiBookmark className="w-8 h-8" color="white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">Saved messages</h3>
                  </div>
                </div>
              ) : (
                <div
                  key={foundUser._id}
                  onClick={() => openChat(foundUser._id)}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{foundUser.username || foundUser.email}</h3>
                  </div>
                </div>
              )
            )
          : chats.map((item) => (
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
