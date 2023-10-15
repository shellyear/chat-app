import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

function SearchBar() {
  const [value, setValue] = useState('')

  return <Form.Control type="search" placeholder="search" value={value} onChange={(e) => setValue(e.target.value)} />
}

export default SearchBar
