import axios from 'axios'
import { withGuestInterceptor } from '@/lib/guestApi'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

withGuestInterceptor(api)

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sufra_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.config?.__guestMock) return Promise.resolve({ data: err.config.__guestMock })
    if (err.config?.__guestBlocked) return Promise.resolve({ data: { status: 'guest_blocked' } })
    if (err.response?.status === 401) {
      import('@/store/guestStore').then(({ useGuestStore }) => {
        if (!useGuestStore.getState().isGuest) {
          localStorage.removeItem('sufra_token')
          localStorage.removeItem('sufra_user')
          window.location.href = '/login'
        }
      })
    }
    return Promise.reject(err)
  }
)

export const SOCKET_URL = BASE_URL