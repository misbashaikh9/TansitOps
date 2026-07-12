import api from './api.js'

export async function getMaintenanceTasks() {
  const response = await api.get('/maintenance')
  return response.data
}

export async function createMaintenanceTask(payload) {
  const response = await api.post('/maintenance', payload)
  return response.data
}
