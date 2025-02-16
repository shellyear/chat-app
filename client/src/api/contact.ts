import { IFoundContact } from '../types/contact'
import { apiClient } from './apiClient'

export const getContacts = async () => {
  const response = await apiClient.get<{ code: string; data: IFoundContact[] }>('/contacts')
  return response.data
}

export const addContact = async (name: string, email: string, surname?: string) => {
  const response = await apiClient.post<{ code: string; data: IFoundContact }>('/contacts', {
    name,
    email,
    surname
  })
  return response.data
}
