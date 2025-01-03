import axios from 'axios'

import Config from '../config'

export const apiClient = axios.create({
  baseURL: `${Config.API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
