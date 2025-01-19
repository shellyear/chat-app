import { getSession, login, logout, verifyCode } from './auth'
import { getChats } from './chat'
import { addContact, getContacts } from './contact'
import { searchUsers } from './search'

const API = {
  auth: {
    getSession,
    login,
    verifyCode,
    logout
  },
  chat: {
    getChats
  },
  search: {
    searchUsers
  },
  contacts: {
    getContacts,
    addContact
  }
}

export default API
