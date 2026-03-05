import { authClient } from '@/shared/api/client'
import type { SignInParams, SignUpParams, SendResetMailParams, PasswordResetParams } from './types'

export const signUp = (params: SignUpParams) => authClient.post('/auth', params)

export const signIn = (params: SignInParams) => authClient.post('/auth/sign_in', params)

export const signOut = () => authClient.delete('/auth/sign_out')

export const getCurrentUser = () => authClient.get('/auth/sessions')

export const sendResetEmail = (params: SendResetMailParams) =>
  authClient.post('/auth/password', { user: { email: params.email } })

export const resetPassword = (params: PasswordResetParams) =>
  authClient.put('/auth/password', {
    user: {
      reset_password_token: params.resetPasswordToken,
      password: params.password,
      password_confirmation: params.passwordConfirmation,
    },
  })
