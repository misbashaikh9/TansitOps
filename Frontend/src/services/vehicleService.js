import api from './api.js'

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

export async function getVehicles() {
  const response = await api.get('/vehicles')
  return normalizeList(response.data)
}

export async function createVehicle(payload) {
  const response = await api.post('/vehicles', payload)
  return response.data
}

export async function updateVehicle(vehicleId, payload) {
  const response = await api.put(`/vehicles/${vehicleId}`, payload)
  return response.data
}

export async function deleteVehicle(vehicleId) {
  const response = await api.delete(`/vehicles/${vehicleId}`)
  return response.data
}
