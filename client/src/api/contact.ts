import { IContact } from '../types/contact'
import { apiClient } from './apiClient'

export const getContacts = async () => {
  const response = await apiClient.get<{ code: string; data: IContact[] }>('/contacts')
  return response.data
}

export const addContact = async (name: string, email: string, surname?: string) => {
  const response = await apiClient.post<{ code: string; data: IContact }>('/contacts', {
    name,
    email,
    surname
  })
  return response.data
}

export const getContact = async (contactId: string) => {
  const response = await apiClient.get<{ code: string; data: IContact }>(`/contacts/${contactId}`)
  return response.data
}
