import { getSession, login, logout, verifyCode } from './auth'
import { getChats } from './chat'

const API = {
  auth: {
    getSession,
    login,
    verifyCode,
    logout
  },
  chat: {
    getChats
  }
}

export default API
