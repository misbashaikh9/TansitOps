import api from './api.js'

export async function getFuelLogs() {
  try {
    const response = await api.get('/fuel')
    return response.data
  } catch (error) {
    if (error.message?.toLowerCase().includes('404')) {
      throw new Error('Fuel API endpoint is not available yet in backend.')
    }

    throw error
  }
}
