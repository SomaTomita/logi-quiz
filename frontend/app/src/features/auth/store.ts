import { create } from 'zustand'
import Cookies from 'js-cookie'
import { getCurrentUser } from './api'
import type { User } from './types'

interface AuthState {
  user: User | null
  isSignedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  setUser: (user: User) => void
  clearUser: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignedIn: false,
  isAdmin: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isSignedIn: true,
      isAdmin: user.admin ?? false,
      isLoading: false,
    }),

  clearUser: () => {
    Cookies.remove('_access_token')
    Cookies.remove('_client')
    Cookies.remove('_uid')
    set({
      user: null,
      isSignedIn: false,
      isAdmin: false,
      isLoading: false,
    })
  },

  initialize: async () => {
    const token = Cookies.get('_access_token')
    const client = Cookies.get('_client')
    const uid = Cookies.get('_uid')

    if (!token || !client || !uid) {
      set({ isLoading: false })
      return
    }

    try {
      const res = await getCurrentUser()
      if (res?.data.isLogin === true) {
        const user = res.data.data as User
        set({
          user,
          isSignedIn: true,
          isAdmin: user.admin ?? false,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }
    } catch {
      set({ isLoading: false })
    }
  },
}))
