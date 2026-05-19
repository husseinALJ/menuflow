import toast from 'react-hot-toast'
import { useGuestStore, getMockResponse } from '@/store/guestStore'

const READ_METHODS = ['get', 'GET']

export function withGuestInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    const { isGuest } = useGuestStore.getState()
    if (!isGuest) return config

    const method = (config.method || 'get').toUpperCase()
    const url = config.url || ''

    if (READ_METHODS.includes(method)) {
      const mock = getMockResponse('GET', url)
      if (mock) {
        // Abort the real request and resolve with mock data
        const controller = new AbortController()
        controller.abort()
        config.signal = controller.signal
        config.__guestMock = mock
      }
    } else {
      // Block writes
      toast('Guest mode — changes are disabled', {
        id: 'guest-write-block',
        duration: 2500,
      })
      const controller = new AbortController()
      controller.abort()
      config.signal = controller.signal
      config.__guestBlocked = true
    }

    return config
  })

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.config?.__guestMock) {
        return Promise.resolve({ data: err.config.__guestMock, status: 200 })
      }
      if (err.config?.__guestBlocked) {
        return Promise.resolve({ data: { status: 'guest_blocked' }, status: 200 })
      }
      return Promise.reject(err)
    }
  )

  return axiosInstance
}