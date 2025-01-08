import ContactsPage from './ContactsPage'
import SettingsPage from './SettingsPage'
import ChatListPage from './ChatListPage'
import useSidebarPage from '../../hooks/useSidebarPage'

export enum SidebarPage {
  SETTINGS_PAGE = 'SETTINGS_PAGE',
  CONTACTS_PAGE = 'CONTACTS_PAGE',
  CHATLIST_PAGE = 'CHAT_LIST_PAGE'
}

function Sidebar() {
  const { currentPage, openSidebarPage } = useSidebarPage()

  const showCurrentSidebarPage = (currentPage: SidebarPage) => {
    switch (currentPage) {
      case SidebarPage.CHATLIST_PAGE:
        return <ChatListPage openSidebarPage={openSidebarPage} />
      case SidebarPage.CONTACTS_PAGE:
        return <ContactsPage />
      case SidebarPage.SETTINGS_PAGE:
        return <SettingsPage openSidebarPage={openSidebarPage} />
      default:
        return <ChatListPage openSidebarPage={openSidebarPage} />
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">{showCurrentSidebarPage(currentPage)}</div>
  )
}

export default Sidebar
