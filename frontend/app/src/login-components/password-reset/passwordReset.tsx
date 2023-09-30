import { useSearchParams } from 'react-router-dom'

import ResetForm from './resetForm'
import SendResetMail from './sendResetMail'

const PasswordReset = () => {
  const [searchParams] = useSearchParams();

  // クエリパラメーターからtokenを取得
  const resetPasswordToken = searchParams.get('reset_password_token')

  
  return (
    <div>
      { resetPasswordToken ?
          <ResetForm resetPasswordToken={resetPasswordToken}/> : <SendResetMail /> }
    </div>
  )
};

export default PasswordReset;