import { SignInParams, SignUpParams } from "../interfaces";
import client from "./client";
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
  return client.delete("/auth/sign_out", {
    headers: { // 認証情報を含むクッキーから取得した値をheadersとしてAPIリクエストに添付 => APIサーバー側でユーザーの認証状態を確認し、サインアウト処理に必要な情報を提供
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// ユーザーが現在ログインしているかどうかをAPIサーバーに確認
export const getCurrentUser = () => { //クッキーに保存されている認証情報を使用してAPIエンドポイント(/auth/sessions)へGETリクエスト
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return; // クッキーのいずれかが存在しない(ログインしていない)場合、関数は終了

  return client.get("/auth/sessions", { // ログインしていれば、id、ユーザー名、メールアドレス等を取得
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};