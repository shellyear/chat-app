import ContactsPage from './ContactsPage'
import SettingsPage from './SettingsPage'
import ChatListPage from './ChatListPage'
import useSidebarPage from '../../hooks/useSidebarPage'

export enum SidebarPage {
  SETTINGS_PAGE = 'SETTINGS_PAGE',
  CONTACTS_PAGE = 'CONTACTS_PAGE',
  CHATLIST_PAGE = 'CHAT_LIST_PAGE'
}

interface ISidebarProps {
  openChat: (chatId: string) => void
}

function Sidebar({ openChat }: ISidebarProps) {
  const { currentPage, openSidebarPage } = useSidebarPage()

  const showCurrentSidebarPage = (currentPage: SidebarPage) => {
    switch (currentPage) {
      case SidebarPage.CHATLIST_PAGE:
        return <ChatListPage openSidebarPage={openSidebarPage} openChat={openChat} />
      case SidebarPage.CONTACTS_PAGE:
        return <ContactsPage />
      case SidebarPage.SETTINGS_PAGE:
        return <SettingsPage openSidebarPage={openSidebarPage} />
      default:
        return <ChatListPage openSidebarPage={openSidebarPage} openChat={openChat} />
    }
  }

  return (
    <div className="w-full shrink-0 bg-white border-r border-gray-200 flex flex-col sm:w-80">
      {showCurrentSidebarPage(currentPage)}
    </div>
  )
}

export default Sidebar
