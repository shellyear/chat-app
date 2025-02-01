import { apiClient } from './apiClient'

export const checkUniqueNameAvailability = async (uniqueName: string) => {
  const response = await apiClient.get('/uniqueNames', {
    params: {
      uniqueName
    }
  })

  return response.data
}
