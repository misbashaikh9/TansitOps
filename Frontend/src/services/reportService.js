import api from './api.js'

export async function getReports() {
  try {
    const response = await api.get('/reports')
    return response.data
  } catch (error) {
    if (error.message?.toLowerCase().includes('404')) {
      throw new Error('Reports API endpoint is not available yet in backend.')
    }

    throw error
  }
}
