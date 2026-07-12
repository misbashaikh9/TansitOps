import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

export { API_BASE_URL }

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackMessage = 'Unable to connect to backend API.'
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage

    return Promise.reject(new Error(message))
  },
)

export default api
