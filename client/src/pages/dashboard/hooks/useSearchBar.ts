import { useState } from 'react'

function useSearchBar<SearchResultType>() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults
  }
}

export default useSearchBar
