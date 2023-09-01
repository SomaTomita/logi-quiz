import { useSearchParams } from 'react-router-dom'

import ResetForm from './resetForm'
import SendResetMail from './sendResetMail'

const PasswordReset = () => {
  const [searchParams] = useSearchParams();

  // クエリパラメーターからtokenを取得
  const resetPasswordToken = searchParams.get('reset_password_token')

  return (
    <div>
      {/* reset_password_tokenが設定されている場合再設定フォームを、
	      設定されていない場合再設定メール送信フォームを表示　*/}
      { resetPasswordToken ?
          <ResetForm resetPasswordToken={resetPasswordToken}/> : <SendResetMail /> }
    </div>
  )
};

export default PasswordReset;