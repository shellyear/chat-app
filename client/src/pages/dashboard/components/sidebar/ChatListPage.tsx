import { ChangeEvent, useEffect, useState } from 'react'
import { CiBookmark } from 'react-icons/ci'
import { IoMdMenu } from 'react-icons/io'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'

import SidebarMenu from './SidebarMenu'
import { SidebarPage } from './Sidebar'
import { IChat } from '../../../../types/chat'
import API from '../../../../api'
import { useAuth } from '../../../../contexts/AuthContext'
import useSearchBar from '../../hooks/useSearchBar'
import SearchInput from '../../../../components/SearchInput'
import { generateChatLink } from '../../../../utils/chat'
import { UniqueNameLookupDoc } from '../../../../types/search'
import { getLookupDocNaming, getLookupDocProfilePicture } from '../../../../utils/uniqueNamesSearch'

interface ISearchBar {
  openSidebarPage: (pageName: SidebarPage) => void
  searchQuery: string
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
}

function SearchBar({ openSidebarPage, searchQuery, handleSearch }: ISearchBar) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="relative min-h-14 px-4 flex items-center">
      <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
        <IoMdMenu onClick={() => toggleMenu()} className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex-grow ml-2">
        <SearchInput value={searchQuery} onChange={handleSearch} />
      </div>
      {isMenuOpen && <SidebarMenu openSidebarPage={openSidebarPage} />}
    </div>
  )
}

interface IChatListPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function ChatListPage({ openSidebarPage }: IChatListPageProps) {
  const { user } = useAuth()
  const [chats, setChats] = useState<IChat[]>([])
  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useSearchBar<UniqueNameLookupDoc>()

  const debouncedSearch = debounce(async (uniqueName: string) => {
    if (uniqueName.trim() === '' || uniqueName.trim().length < 3) {
      setSearchResults([])
      return
    }

    try {
      const { data } = await API.search.searchByUniqueName(uniqueName)
      setSearchResults(data.data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search error:', error)
    }
  }, 300)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
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
          ? searchResults.map((foundLookupDoc) => {
              const foundLookupDocId = foundLookupDoc.referenceId
              const foundLookupDocNaming = getLookupDocNaming(foundLookupDoc)
              const foundLookupDocProfilePicture = getLookupDocProfilePicture(foundLookupDoc)
              return foundLookupDoc.uniqueName === user.uniqueName ? (
                <Link
                  to={generateChatLink(foundLookupDoc.uniqueName, foundLookupDocId)}
                  key={user.uniqueName}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="box-border flex items-center justify-center w-12 h-12 rounded-full bg-blue-400 mr-4">
                    <CiBookmark className="w-8 h-8" color="white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">Saved messages</h3>
                  </div>
                </Link>
              ) : (
                <Link
                  to={generateChatLink(foundLookupDoc.uniqueName, foundLookupDocId)}
                  key={foundLookupDocId}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                >
                  {foundLookupDocProfilePicture ? (
                    <img
                      src={foundLookupDocProfilePicture}
                      alt="User Avatar"
                      className="mr-4 w-12 h-12 rounded-full object-cover filter brightness-[0.8]"
                    />
                  ) : (
                    <div className="mr-4 w-12 h-12 bg-gray-300 rounded-full" />
                  )}
                  <div>
                    <div className="text-base font-medium">{foundLookupDocNaming}</div>
                    <div className="text-sm text-gray-500">{`@${foundLookupDoc.uniqueName}`}</div>
                  </div>
                </Link>
              )
            })
          : chats.map((item) => (
              <Link
                to={`/${item._id}`}
                key={item._id}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">
                    User {item.participantsIds.find((participant) => participant._id !== user.userId).email}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">Last message...</p>
                </div>
              </Link>
            ))}
      </div>
    </>
  )
}

export default ChatListPage
