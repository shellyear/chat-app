import axios from 'axios'

import { getSession } from './auth'
import Config from '../config'

export const apiClient = axios.create({
  baseURL: `${Config.API_BASE_URL}/api`,
  withCredentials: true
})

const API = {
  auth: {
    getSession
  }
}

export default API
