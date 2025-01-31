import { getSession, login, logout, verifyCode } from './auth'
import { getChat, getChatMessages, getChats } from './chat'
import { addContact, getContact, getContacts } from './contact'
import { searchUsers } from './search'
import { getUser, setProfileInfo } from './user'

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
    addContact,
    getContact
  },
  user: {
    getUser,
    setProfileInfo
  }
}

export default API
