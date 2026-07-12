import api from './api.js'

export async function getMaintenanceTasks() {
  const response = await api.get('/maintenance')
  return response.data
}
