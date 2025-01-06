import { SidebarPage } from './Sidebar'

interface IMenuProps {
  openSidebarPage: (pageName: SidebarPage) => void
}

function SidebarMenu({ openSidebarPage }: IMenuProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <ul className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <li
          onClick={() => openSidebarPage(SidebarPage.SETTINGS_PAGE)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {/* <Settings className="inline-block w-4 h-4 mr-2" /> */}
          Settings
        </li>
        <li
          onClick={() => openSidebarPage(SidebarPage.CONTACTS_PAGE)}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          {/* <Users className="inline-block w-4 h-4 mr-2" /> */}
          Contacts
        </li>
      </ul>
    </div>
  )
}

export default SidebarMenu
