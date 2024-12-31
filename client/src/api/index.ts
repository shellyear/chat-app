import axios from 'axios'

import { getSession } from './auth'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true
})

const API = {
  auth: {
    getSession
  }
}

export default API
