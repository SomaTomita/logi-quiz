// 認証関連のAPIエンドポイント（DeviseTokenAuth対応）
// authClientを使用（snake_case⇔camelCase自動変換付き）
import { authClient } from '@/shared/api/client'
import type { SignInParams, SignUpParams, SendResetMailParams, PasswordResetParams } from './types'

// ユーザー登録 — レスポンスヘッダーに認証トークンが含まれる
export const signUp = (params: SignUpParams) => authClient.post('/auth', params)

// ログイン — レスポンスヘッダーに認証トークンが含まれる
export const signIn = (params: SignInParams) => authClient.post('/auth/sign_in', params)

// ログアウト — サーバー側でトークンを無効化
export const signOut = () => authClient.delete('/auth/sign_out')

// ログイン状態確認 — Cookieのトークンでバックエンドに問い合わせ
export const getCurrentUser = () => authClient.get('/auth/sessions')

// パスワードリセットメール送信
export const sendResetEmail = (params: SendResetMailParams) =>
  authClient.post('/auth/password', { user: { email: params.email } })

// パスワードリセット実行（メールのリンクから取得したトークンを使用）
export const resetPassword = (params: PasswordResetParams) =>
  authClient.put('/auth/password', {
    user: {
      reset_password_token: params.resetPasswordToken,
      password: params.password,
      password_confirmation: params.passwordConfirmation,
    },
  })
