import api from './api.js'

export async function getDrivers() {
  const response = await api.get('/drivers')
  return response.data
}

export async function getDriverById(driverId) {
  const response = await api.get(`/drivers/${driverId}`)
  return response.data
}

export async function createDriver(payload) {
  const response = await api.post('/drivers', payload)
  return response.data
}

export async function updateDriver(driverId, payload) {
  const response = await api.put(`/drivers/${driverId}`, payload)
  return response.data
}

export async function deleteDriver(driverId) {
  const response = await api.delete(`/drivers/${driverId}`)
  return response.data
}
