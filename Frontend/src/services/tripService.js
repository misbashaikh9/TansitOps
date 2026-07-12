import api from './api.js'

export async function getTrips() {
  const response = await api.get('/trips')
  return response.data
}

export async function getTripById(tripId) {
  const response = await api.get(`/trips/${tripId}`)
  return response.data
}

export async function createTrip(payload) {
  const response = await api.post('/trips', payload)
  return response.data
}

export async function updateTrip(tripId, payload) {
  const response = await api.put(`/trips/${tripId}`, payload)
  return response.data
}

export async function deleteTrip(tripId) {
  const response = await api.delete(`/trips/${tripId}`)
  return response.data
}

export async function dispatchTrip(tripId) {
  const response = await api.patch(`/trips/${tripId}/dispatch`)
  return response.data
}

export async function completeTrip(tripId, payload) {
  const response = await api.patch(`/trips/${tripId}/complete`, payload)
  return response.data
}

export async function cancelTrip(tripId) {
  const response = await api.patch(`/trips/${tripId}/cancel`)
  return response.data
}
