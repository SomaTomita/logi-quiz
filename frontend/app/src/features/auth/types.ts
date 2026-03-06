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

// バックエンドAuth::SessionsController#SAFE_USER_FIELDSに対応するユーザー型
// axios-case-converterによりsnake_case → camelCaseに自動変換される
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
  totalPlayTime: number | null
  totalQuestionsCleared: number | null
  createdAt: string
  updatedAt: string
}

export interface SendResetMailParams {
  email: string
}

export interface PasswordResetParams {
  resetPasswordToken: string
  password: string
  passwordConfirmation: string
}
