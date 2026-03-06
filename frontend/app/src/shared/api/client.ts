import axios, { AxiosResponse, AxiosError } from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import Cookies from 'js-cookie'

const options = { ignoreHeaders: true }

// DeviseTokenAuthのtoken_lifespan（2週間）に合わせたCookie有効期限
const TOKEN_EXPIRY_DAYS = 14

// --- Auth API client（DeviseTokenAuth用、snake_case⇔camelCase自動変換） ---
export const authClient = applyCaseMiddleware(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  }),
  options,
)

// --- General API client（snake_caseのまま使用） ---
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// --- 認証トークンのCookie保存ヘルパー ---
// SignIn/SignUpページから呼び出し、レスポンスインターセプターからも使用
// Cookie有効期限をDeviseTokenAuthのtoken_lifespanと一致させる
export const setAuthCookies = (headers: Record<string, string>) => {
  const token = headers['access-token']
  const client = headers['client']
  const uid = headers['uid']
  if (token && client && uid) {
    Cookies.set('_access_token', token, { expires: TOKEN_EXPIRY_DAYS })
    Cookies.set('_client', client, { expires: TOKEN_EXPIRY_DAYS })
    Cookies.set('_uid', uid, { expires: TOKEN_EXPIRY_DAYS })
  }
}

// 認証Cookieを全て削除
export const clearAuthCookies = () => {
  Cookies.remove('_access_token')
  Cookies.remove('_client')
  Cookies.remove('_uid')
}

// --- リクエストインターセプター: 全リクエストに認証ヘッダーを付与 ---
const attachAuthHeaders = (config: any) => {
  const token = Cookies.get('_access_token')
  const client = Cookies.get('_client')
  const uid = Cookies.get('_uid')
  if (token && client && uid) {
    config.headers['access-token'] = token
    config.headers['client'] = client
    config.headers['uid'] = uid
  }
  return config
}

// --- レスポンスインターセプター: トークン更新とエラーハンドリング ---
// DeviseTokenAuthがレスポンスヘッダーで新しいトークンを返した場合にCookieを更新
const updateAuthHeaders = (response: AxiosResponse) => {
  const token = response.headers['access-token']
  if (token) {
    setAuthCookies(response.headers as Record<string, string>)
  }
  return response
}

// 401エラー時にCookieをクリア（トークン期限切れ対応）
// store.clearUser()は循環参照になるため、Cookieクリアのみ実施
// 次回のページ遷移時にinitialize()でログアウト状態が検知される
const handleAuthError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    clearAuthCookies()
  }
  return Promise.reject(error)
}

// インターセプター登録（両クライアントに適用）
authClient.interceptors.request.use(attachAuthHeaders)
apiClient.interceptors.request.use(attachAuthHeaders)
authClient.interceptors.response.use(updateAuthHeaders, handleAuthError)
apiClient.interceptors.response.use(updateAuthHeaders, handleAuthError)
