import { getSession, login, logout, verifyCode } from './auth'

const API = {
  auth: {
    getSession,
    login,
    verifyCode,
    logout
  }
}

export default API
