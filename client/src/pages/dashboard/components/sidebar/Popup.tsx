import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { IoMdClose } from 'react-icons/io'

import API from '../../../../api'

interface IPopupProps {
  isOpen: boolean
  onClose?: () => void
  closeOnOutsideClick?: boolean
}

export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    setIsOpen
  }
}

function Popup({ isOpen, onClose, closeOnOutsideClick = false }: IPopupProps) {
  const popupRef = useRef<HTMLDivElement>()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    if (closeOnOutsideClick) {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          onClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeOnOutsideClick, onClose])

  const onAddButtonClick = async () => {
    try {
      await API.contacts.addContact(firstName, email, lastName)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while adding contact', error)
    } finally {
      onClose()
    }
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-3 px-4 rounded-lg shadow-lg w-96 max-w-full" ref={popupRef}>
        <div className="flex justify-between items-center">
          <button type="button" onClick={onClose}>
            <IoMdClose className="w-6 h-6" color="gray" />
          </button>
          <h2 className="text-lg font-bold">Add Contact</h2>
          <button
            type="button"
            className="p-2 bg-blue-400 rounded text-white text-sm hover:bg-blue-500"
            onClick={onAddButtonClick}
          >
            ADD
          </button>
        </div>

        <div className="flex gap-4 mt-4 items-center">
          <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex flex-col w-full gap-4">
            <input
              type="text"
              required
              placeholder="First name (required)"
              className="w-full min-h-14 p-2 px-4 border border-gray-200 rounded-lg focus:outline-blue-400"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name (optional)"
              className="w-full min-h-14 p-2 px-4 border border-gray-200 rounded-lg focus:outline-blue-400"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <input
            placeholder="Email"
            type="email"
            required
            className="w-full min-h-14 p-2 px-4 border border-gray-200 rounded-lg focus:outline-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>,
    document.getElementById('popup-root')
  )
}

export default Popup
