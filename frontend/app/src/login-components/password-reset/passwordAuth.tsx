import Cookies from "js-cookie";
import client from "../api/client";

// パスワード再設定関連の型
export type SendResetMailType = {
  email: string;
};
export type PasswordResetType = {
  resetPasswordToken: string;
  password: string;
  passwordConfirmation: string;
};

// パスワード再設定メール送信関数
export const sendEmail = (params: SendResetMailType) =>
  client.post("/auth/password", {
    user: {
      email: params.email,
    },
  })
  .then((res) => {
    return res.data;
  })
  .catch((error) => {
    throw new Error(error.response.data.error || 'An error occurred.');
  });


  // パスワード再設定実行関数
  export const onReset = (params: PasswordResetType) =>
    client.put("/auth/password", {
      headers: {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
      user: {
        reset_password_token: params.resetPasswordToken,
        password: params.password,
        password_confirmation: params.passwordConfirmation,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw new Error(error.response.data.error || 'An error occurred.');
    });

  // export
export const PasswordReset = {
    sendEmail,
    onReset
  }