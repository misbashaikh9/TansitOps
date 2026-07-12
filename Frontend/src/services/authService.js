import api from './api.js'

export async function getBackendHealth() {
  const response = await api.get('/health')
  return response.data
}

export async function signUpUser(payload) {
  const response = await api.post('/auth/signup', payload)
  return response.data
}

export async function signInUser(payload) {
  const response = await api.post('/auth/login', payload)
  return response.data
}
