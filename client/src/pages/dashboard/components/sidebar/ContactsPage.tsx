import { ChangeEvent, useEffect, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { FaPlus } from 'react-icons/fa6'

import { SidebarPage } from './Sidebar'
import SearchInput from '../../../../components/SearchInput'
import useSearchBar from '../../hooks/useSearchBar'
import { IUser } from '../../../../types/user'
import API from '../../../../api'
import { IContact } from '../../../../types/contact'
import RoundedButton from '../../../../components/RoundedButton'
import Popup, { usePopup } from './Popup'

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
  const [contacts, setContacts] = useState<IContact[]>([])
  const { isOpen, setIsOpen } = usePopup()

  const handleSearch = () => {}

  const fetchContacts = async () => {
    try {
      const { data } = await API.contacts.getContacts()
      setContacts(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching contacts:', error)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <>
      <SearchBar openSidebarPage={openSidebarPage} searchQuery={searchQuery} handleSearch={handleSearch} />
      <div className="flex-grow overflow-y-auto" />
      <RoundedButton
        className="absolute bottom-6 right-6"
        onClick={() => setIsOpen((prev) => !prev)}
        icon={<FaPlus className="h-6 w-6" color="white" />}
      />
      <Popup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default ContactsPage
