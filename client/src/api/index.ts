import { getSession, login, logout, verifyCode } from './auth'
import { getChat, getChatMessages, getChats } from './chat'
import { addContact, getContact, getContacts } from './contact'
import { searchByUniqueName } from './search'
import { checkUniqueNameAvailability } from './uniqueName'
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
    searchByUniqueName
  },
  contacts: {
    getContacts,
    addContact,
    getContact
  },
  user: {
    getUser,
    setProfileInfo
  },
  uniqueName: {
    checkUniqueNameAvailability
  }
}

export default API
