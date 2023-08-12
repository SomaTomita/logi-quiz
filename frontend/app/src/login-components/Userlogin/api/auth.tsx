import { SignInParams, SignUpParams } from "../Interfaces";
import client from "./Client";
import Cookies from "js-cookie";

// サインアップ
export const signUp = (params: SignUpParams) => {
  return client.post("/auth", params); //Interfaceで定義したサインアップ情報(params)を受け取り APIエンドポイント(/auth)へPOSTリクエスト
};

// サインイン
export const signIn = (params: SignInParams) => {
  return client.post("/auth/sign_in", params); //Interfaceで定義したサインイン情報(params)を受け取り APIエンドポイント(/auth/sign_in)へPOSTリクエスト
};

// サインアウト
export const signOut = () => {
  return client.delete("/auth/sign_out", { // Cookiesの情報をヘッダーに付けてAPIエンドポイント(/auth/sign_out)へDELETEリクエスト
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ログインユーザーの取得
export const getCurrentUser = () => { //クッキーに保存されている認証情報を使用してAPIエンドポイント(/auth/sessions)へGETリクエスト
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return; // 情報が欠けている場合、関数は早期に終了

  return client.get("/auth/sessions", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};