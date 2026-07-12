import api from './api.js'

export async function getVehicles() {
  const response = await api.get('/vehicles')
  return response.data
}
