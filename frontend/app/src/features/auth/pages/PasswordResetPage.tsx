import { useSearchParams } from 'react-router-dom'
import ResetForm from '../components/ResetForm'
import SendResetMail from '../components/SendResetMail'

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams()
  const resetPasswordToken = searchParams.get('reset_password_token')

  return resetPasswordToken ? (
    <ResetForm resetPasswordToken={resetPasswordToken} />
  ) : (
    <SendResetMail />
  )
}

export default PasswordResetPage
