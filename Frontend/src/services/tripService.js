import api from './api.js'

export async function getTrips() {
  const response = await api.get('/trips')
  return response.data
}
