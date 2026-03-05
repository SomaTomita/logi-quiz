export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  confirmSuccessUrl: string | undefined
}

export interface SignInParams {
  email: string
  password: string
}

export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  nickname?: string
  image?: string
  admin: boolean
  allowPasswordChange: boolean
  created_at: string
  updated_at: string
}

export interface SendResetMailParams {
  email: string
}

export interface PasswordResetParams {
  resetPasswordToken: string
  password: string
  passwordConfirmation: string
}
