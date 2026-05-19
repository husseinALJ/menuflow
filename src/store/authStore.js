import { create } from 'zustand'
import { api } from '@/lib/api'
import { useGuestStore, GUEST_ROLES } from '@/store/guestStore'

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('sufra_user') || 'null'),
  token: localStorage.getItem('sufra_token') || null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/api/auth/login', { username, password })
      const user = data.data.user
      const token = data.token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const enrichedUser = { ...user, role: payload.role }
      localStorage.setItem('sufra_token', token)
      localStorage.setItem('sufra_user', JSON.stringify(enrichedUser))
      set({ user: enrichedUser, token, loading: false })
      return enrichedUser
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
      set({ error: msg, loading: false })
      throw new Error(msg)
    }
  },

  loginAsGuest: (role = 'Admin') => {
    const guestUser = { id: 0, username: `guest_${role.toLowerCase()}`, role }
    useGuestStore.getState().enterGuest(role)
    set({ user: guestUser, token: 'guest' })
    return guestUser
  },

  logout: () => {
    localStorage.removeItem('sufra_token')
    localStorage.removeItem('sufra_user')
    useGuestStore.getState().exitGuest()
    set({ user: null, token: null })
  },

  isAdmin: () => get().user?.role === 'Admin',
  isChef: () => get().user?.role === 'Chef',
  isWaiter: () => get().user?.role === 'Waiter',
  isCashier: () => get().user?.role === 'Cashier',
}))