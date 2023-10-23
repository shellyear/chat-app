import { DocumentData, collection, getDocs, query, where } from 'firebase/firestore'
import { ChangeEvent, ChangeEventHandler, FocusEventHandler, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

import { db } from '../../firebase'

type Props = {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement> // onfocusin
  onBlur?: FocusEventHandler<HTMLInputElement> // onfocusout
}

export const useSearchBar = () => {
  const [value, setValue] = useState<string>()
  const [data, setData] = useState<DocumentData[]>()
  const [isFocused, setIsFocused] = useState<boolean>(false)

  useEffect(() => {
    if (value) {
      const usersRef = collection(db, 'users')
      const condition = where('email', '==', value)
      const q = query(usersRef, condition)
      getDocs(q).then((querySnapshot) => {
        const result = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          result.push(doc.data())
        })
        setData(result)
      })
    }
  }, [value])
  const onFocus = () => setIsFocused(true)
  const onBlur = () => setIsFocused(false)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

  return {
    value,
    data,
    isFocused,
    onChange,
    onFocus,
    onBlur
  }
}

function SearchBar({ value, onChange, ...props }: Props) {
  return <Form.Control type="search" placeholder="search" value={value} onChange={onChange} {...props} />
}

export default SearchBar
