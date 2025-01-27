import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import ContactsPage from './ContactsPage'
import SettingsPage from './SettingsPage'
import ChatListPage from './ChatListPage'
import useSidebarPage from '../../hooks/useSidebarPage'
import EditSettingsPage from './EditSettingsPage'

export enum SidebarPage {
  SETTINGS_PAGE = 'SETTINGS_PAGE',
  EDIT_SETTINGS_PAGE = 'EDIT_SETTINGS_PAGE',
  CONTACTS_PAGE = 'CONTACTS_PAGE',
  CHATLIST_PAGE = 'CHAT_LIST_PAGE'
}

function Sidebar() {
  const { id } = useParams<{ id?: string }>()
  const { currentPage, openSidebarPage } = useSidebarPage()

  const showCurrentSidebarPage = (currentPage: SidebarPage) => {
    switch (currentPage) {
      case SidebarPage.CHATLIST_PAGE:
        return <ChatListPage openSidebarPage={openSidebarPage} />
      case SidebarPage.CONTACTS_PAGE:
        return <ContactsPage openSidebarPage={openSidebarPage} />
      case SidebarPage.SETTINGS_PAGE:
        return <SettingsPage openSidebarPage={openSidebarPage} />
      case SidebarPage.EDIT_SETTINGS_PAGE:
        return <EditSettingsPage openSidebarPage={openSidebarPage} />
      default:
        return <ChatListPage openSidebarPage={openSidebarPage} />
    }
  }

  useEffect(() => {
    if (id) {
      openSidebarPage(SidebarPage.CHATLIST_PAGE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="relative w-full shrink-0 bg-white border-r border-gray-200 flex flex-col sm:w-80">
      {showCurrentSidebarPage(currentPage)}
    </div>
  )
}

export default Sidebar
