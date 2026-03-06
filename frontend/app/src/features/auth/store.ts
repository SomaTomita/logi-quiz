import { create } from 'zustand'
import Cookies from 'js-cookie'
import { getCurrentUser } from './api'
import { clearAuthCookies } from '@/shared/api/client'
import type { User } from './types'

// 認証状態の型定義
interface AuthState {
  user: User | null
  isSignedIn: boolean
  isAdmin: boolean
  isLoading: boolean
  setUser: (user: User) => void
  clearUser: () => void
  initialize: () => Promise<void>
}

// Zustandによる認証状態管理ストア
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isSignedIn: false,
  isAdmin: false,
  isLoading: true,

  // ログイン成功時にユーザー情報をストアに保存
  setUser: (user) =>
    set({
      user,
      isSignedIn: true,
      isAdmin: user.admin ?? false,
      isLoading: false,
    }),

  // ログアウト時にCookieとストアをクリア
  clearUser: () => {
    clearAuthCookies()
    set({
      user: null,
      isSignedIn: false,
      isAdmin: false,
      isLoading: false,
    })
  },

  // アプリ起動時の認証状態復元
  // Cookieにトークンがあればバックエンドに確認し、ログイン状態を復元
  initialize: async () => {
    const token = Cookies.get('_access_token')
    const client = Cookies.get('_client')
    const uid = Cookies.get('_uid')

    // トークンが揃っていない場合は未ログイン
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
      // 401等のエラー時はレスポンスインターセプターがCookieをクリア済み
      set({ isLoading: false })
    }
  },
}))
