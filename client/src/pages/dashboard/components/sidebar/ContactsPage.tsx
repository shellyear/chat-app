import { ChangeEvent, useEffect } from 'react'
import { IoMdArrowBack } from 'react-icons/io'

import { SidebarPage } from './Sidebar'
import SearchInput from '../../../../components/SearchInput'
import useSearchBar from '../../hooks/useSearchBar'
import { IUser } from '../../../../types/user'

interface ISearchBar {
  openSidebarPage: (pageName: SidebarPage) => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  searchQuery: string
}

function SearchBar({ openSidebarPage, searchQuery, handleSearch }: ISearchBar) {
  return (
    <div className="relative p-4 flex items-center border-b border-gray-200">
      <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
        <IoMdArrowBack onClick={() => openSidebarPage(SidebarPage.CHATLIST_PAGE)} className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex-grow ml-2">
        <SearchInput value={searchQuery} onChange={handleSearch} />
      </div>
    </div>
  )
}

interface IContactsPageProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function ContactsPage({ openSidebarPage }: IContactsPageProps) {
  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useSearchBar<IUser>()

  const handleSearch = () => {}

  useEffect(() => {}, [])

  return (
    <>
      <SearchBar openSidebarPage={openSidebarPage} searchQuery={searchQuery} handleSearch={handleSearch} />
      <div className="flex-grow overflow-y-auto" />
    </>
  )
}

export default ContactsPage
