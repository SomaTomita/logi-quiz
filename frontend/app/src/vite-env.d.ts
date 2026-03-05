/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CONFIRM_SUCCESS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
