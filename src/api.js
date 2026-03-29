import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

export const getCooks = (params) => API.get('/cooks/', { params })
export const getCook = (id) => API.get(`/cooks/${id}`)
export const toggleAvailability = (id, data) => API.patch(`/cooks/${id}/availability`, data)
export const getCookDashboard = (id) => API.get(`/cooks/${id}/dashboard`)

export const placeOrder = (data) => API.post('/orders/', data)
export const getMyOrders = () => API.get('/orders/my-orders')
export const updateOrderStatus = (data) => API.patch('/orders/status', data)
export const getAvailableDeliveries = () => API.get('/orders/available-deliveries')

export const getPolls = () => API.get('/polls/')
export const votePoll = (data) => API.post('/polls/vote', data)
export const createPoll = (data) => API.post('/polls/', data)

export const getReviews = (cookId) => API.get(`/reviews/${cookId}`)
export const submitReview = (data) => API.post('/reviews/', data)
