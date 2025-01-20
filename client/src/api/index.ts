import { getSession, login, logout, verifyCode } from './auth'
import { getChat, getChatMessages, getChats } from './chat'
import { addContact, getContacts } from './contact'
import { searchUsers } from './search'
import { getUser } from './user'

const API = {
  auth: {
    getSession,
    login,
    verifyCode,
    logout
  },
  chat: {
    getChats,
    getChat,
    getChatMessages
  },
  search: {
    searchUsers
  },
  contacts: {
    getContacts,
    addContact
  },
  user: {
    getUser
  }
}

export default API
