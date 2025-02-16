import { getSession, login, logout, verifyCode, setupAccount } from './auth'
import { getChat, getChatMessages, getChats } from './chat'
import { addContact, getContacts } from './contact'
import { getPeerById } from './peer'
import { searchByUniqueName } from './search'
import { checkUniqueNameAvailability } from './uniqueName'
import { getUser, setProfileInfo } from './user'

const API = {
  auth: {
    login,
    getSession,
    verifyCode,
    setupAccount,
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
    addContact
  },
  user: {
    getUser,
    setProfileInfo
  },
  uniqueName: {
    checkUniqueNameAvailability
  },
  peer: {
    getPeerById
  }
}

export default API
