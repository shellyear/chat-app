import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { FaPlus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

import { SidebarPage } from './Sidebar'
import SearchInput from '../../../../components/SearchInput'
import useSearchBar from '../../hooks/useSearchBar'
import API from '../../../../api'
import { IFoundContact } from '../../../../types/contact'
import RoundedButton from '../../../../components/RoundedButton'
import Popup, { usePopup } from './Popup'
import Avatar from '../../../../components/Avatar'
import { generateChatLink } from '../../../../utils/chat'

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
    <div className="relative min-h-14 box-border px-4 flex items-center">
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
  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useSearchBar<IFoundContact>()
  const [contacts, setContacts] = useState<IFoundContact[]>([])
  const { isOpen, setIsOpen } = usePopup()

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.trim() === '') {
      setSearchResults([])
      return
    }
    setSearchQuery(value)
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
        {searchResults.length > 0
          ? searchResults.map((foundContact) => (
              <Link
                key={foundContact.contactId}
                to={generateChatLink(foundContact.contactDetails.uniqueName, foundContact.contactId)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                {foundContact.contactDetails.profilePicture ? (
                  <img
                    src={foundContact.contactDetails.profilePicture}
                    alt="profile img"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <Avatar name={foundContact.name} size="sm" className="mr-4" />
                )}
                <div className="flex-grow">
                  <h3>{`${foundContact.name} ${foundContact.surname}`}</h3>
                </div>
              </Link>
            ))
          : contacts.map((contact) => (
              <Link
                key={contact.contactId}
                to={generateChatLink(contact.contactDetails.uniqueName, contact.contactId)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                {contact.contactDetails.profilePicture ? (
                  <img
                    src={contact.contactDetails.profilePicture}
                    alt="profile img"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <Avatar name={contact.name} size="sm" className="mr-4" />
                )}
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
