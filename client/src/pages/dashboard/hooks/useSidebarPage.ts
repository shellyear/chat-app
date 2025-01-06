import { useState } from 'react'

import { SidebarPage } from '../components/sidebar/Sidebar'

const useSidebarPage = () => {
  const [currentPage, setCurrentPage] = useState<SidebarPage>(SidebarPage.CHATLIST_PAGE)

  const openSidebarPage = (pageName: SidebarPage) => {
    setCurrentPage(pageName)
  }

  return {
    currentPage,
    openSidebarPage
  }
}

export default useSidebarPage
