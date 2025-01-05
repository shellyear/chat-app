import axios from 'axios'

import Config from '../config'

const sessionId = sessionStorage.getItem('sessionId')

export const apiClient = axios.create({
  baseURL: `${Config.API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    ...(sessionId && { Authorization: `Bearer ${sessionId}` })
  },
  withCredentials: true
})
