import api from './api.js'

export async function getDrivers() {
  const response = await api.get('/drivers')
  return response.data
}
