import api from './api.js'

export async function getVehicles() {
  const response = await api.get('/vehicles')
  return response.data
}

export async function createVehicle(payload) {
  const response = await api.post('/vehicles', payload)
  return response.data
}

export async function updateVehicle(vehicleId, payload) {
  try {
    const response = await api.put(`/vehicles/${vehicleId}`, payload)
    return response.data
  } catch (error) {
    if (String(error.message).includes('404')) {
      throw new Error('Update vehicle endpoint is not available in backend yet.')
    }

    throw error
  }
}

export async function deleteVehicle(vehicleId) {
  try {
    const response = await api.delete(`/vehicles/${vehicleId}`)
    return response.data
  } catch (error) {
    if (String(error.message).includes('404')) {
      throw new Error('Delete vehicle endpoint is not available in backend yet.')
    }

    throw error
  }
}
