import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

import { SidebarPage } from './Sidebar'
import SearchInput from '../../../../components/SearchInput'
import useSearchBar from '../../hooks/useSearchBar'
import { IUser } from '../../../../types/user'
import API from '../../../../api'
import { IContact } from '../../../../types/contact'
import RoundedButton from '../../../../components/RoundedButton'
import Popup, { usePopup } from './Popup'
import Avatar from '../../../../components/Avatar'

interface ISearchBar {
  openSidebarPage: (pageName: SidebarPage) => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  searchQuery: string
}

function SearchBar({ openSidebarPage, searchQuery, handleSearch }: ISearchBar) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [inputRef])

  return (
    <div className="relative p-4 flex items-center border-b border-gray-200">
      <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
        <IoMdArrowBack onClick={() => openSidebarPage(SidebarPage.CHATLIST_PAGE)} className="h-5 w-5 text-gray-500" />
      </button>
      <div className="flex-grow ml-2">
        <SearchInput ref={inputRef} value={searchQuery} onChange={handleSearch} />
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

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
      <div className="flex-grow overflow-y-auto">
        {contacts.map((contact) => (
          <Link
            key={contact.contactId._id}
            to={`/${contact.contactId?.username || contact.contactId._id}`}
            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
          >
            {contact.contactId.profilePicture ? <div /> : <Avatar name={contact.name} size="sm" className="mr-4" />}
            <div className="flex-grow">
              <h3>{`${contact.name} ${contact.surname}`}</h3>
            </div>
          </Link>
        ))}
      </div>
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
