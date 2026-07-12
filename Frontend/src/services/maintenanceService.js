import api from './api.js'

export async function getMaintenanceTasks() {
  try {
    const response = await api.get('/maintenance')
    return response.data
  } catch (error) {
    if (error.message?.toLowerCase().includes('404')) {
      throw new Error('Maintenance API endpoint is not available yet in backend.')
    }

    throw error
  }
}
