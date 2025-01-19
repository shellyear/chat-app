import { useEffect, useState } from 'react'

import { Breakpoints } from '../constants/breakpoints'

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < Breakpoints.TABLET)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < Breakpoints.TABLET)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile
  }
}

export default useIsMobile
