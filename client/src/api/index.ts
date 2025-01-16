import { getSession, login, logout, verifyCode } from './auth'
import { getChats } from './chat'
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
  }
}

export default API
