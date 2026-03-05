import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import Cookies from 'js-cookie'

const options = { ignoreHeaders: true }

// Auth API client (with case conversion for DeviseTokenAuth)
export const authClient = applyCaseMiddleware(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  }),
  options,
)

// General API client (no case conversion — snake_case types match Rails API)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Auto-attach auth headers to all requests
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

authClient.interceptors.request.use(attachAuthHeaders)
apiClient.interceptors.request.use(attachAuthHeaders)
