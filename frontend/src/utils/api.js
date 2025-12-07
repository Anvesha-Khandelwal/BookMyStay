import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Hotels API
export const getHotels = async (params = {}) => {
  const response = await api.get('/hotels', { params })
  return response.data
}

export const getHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`)
  return response.data
}

export const searchHotels = async (query) => {
  const response = await api.get('/hotels/search', { params: { q: query } })
  return response.data
}

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

// Booking API
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData)
  return response.data
}

export const getBookings = async () => {
  const response = await api.get('/bookings')
  return response.data
}

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`)
  return response.data
}

// Offers API
export const validateOffer = async (code) => {
  const response = await api.post('/offers/validate', { code })
  return response.data
}

export default api

