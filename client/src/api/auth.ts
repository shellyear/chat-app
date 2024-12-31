/* eslint-disable import/no-cycle */
import { apiClient } from '.'

export const getSession = () => {
  return apiClient.get('/auth/session')
}
