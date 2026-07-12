import api from './api.js'

export async function getFuelLogs() {
  const response = await api.get('/fuel')
  return response.data
}

export async function createFuelLog(payload) {
  const response = await api.post('/fuel', payload)
  return response.data
}

export async function createExpenseLog(payload) {
  const response = await api.post('/fuel/expenses', payload)
  return response.data
}

export async function getExpenseLogs() {
  const response = await api.get('/fuel/expenses')
  return response.data
}
