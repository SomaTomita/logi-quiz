import { SignInParams, SignUpParams } from "../interfaces";
import client from "./client";
import Cookies from "js-cookie";


export const signUp = (params: SignUpParams) => {
  return client.post("/auth", params);
};


export const signIn = (params: SignInParams) => {
  return client.post("/auth/sign_in", params);
};


export const signOut = () => {
  return client.delete("/auth/sign_out", {
    headers: { // 認証情報を含むクッキーから取得した値をheadersとしてAPIリクエストに添付 => APIサーバー側でユーザーの認証状態を確認し、サインアウト処理に必要な情報を提供
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};


// ユーザーが現在ログインしているかどうかをAPIサーバーに確認
export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return;

  return client.get("/auth/sessions", { // ログインしていれば、id、ユーザー名、メールアドレス等を取得
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};