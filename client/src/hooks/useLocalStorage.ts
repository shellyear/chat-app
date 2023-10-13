import { Dispatch, SetStateAction, useState } from 'react'

export const useLocalStorage = <T>(keyName: string, defaultValue: any): [T, Dispatch<SetStateAction<any>>] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(keyName)
      if (value) {
        return JSON.parse(value)
      }
      localStorage.setItem(keyName, JSON.stringify(defaultValue))
      return defaultValue
    } catch (err) {
      return defaultValue
    }
  })

  const setValue = (newValue: any) => {
    try {
      localStorage.setItem(keyName, JSON.stringify(newValue))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
    setStoredValue(newValue)
  }

  return [storedValue, setValue]
}
