import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";

import { AuthContext } from "App";
import AlertMessage from "../utils/alertMessage";
import { signUp } from "../api/auth";
import { SignUpParams } from "../interfaces";

// サインアップ用ページ
const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const { setIsSignedIn, setCurrentUser, setIsAdmin } = useContext(AuthContext);

  // ユーザーの入力を管理するためのローカルステート
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => { // <button>要素のマウスイベントとして発火
    e.preventDefault();

    const params: SignUpParams = { // 入力された情報をparamsとしてまとめる
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    };
  
    try {
      const res = await signUp(params); // バックエンドに対してサインアップ要求を行う際に使用されるデータを提供
      console.log(res);

      if (res.status === 200) { // APIリクエストが成功した場合（サインアップが正常に行われた場合(HTTPプロトコルにおいて、ステータスコード200は「OK」)
        // 第一引数の特定のクッキーの名前（キー）に、第二引数のクッキーの値を関連付けて保存     
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data); // APIのレスポンスdata本体のdataキー内のオブジェクト(ID、メールアドレス、名前)を取得してcurrentUserに
        setIsAdmin(res?.data.data.admin);

        navigate("/confirmation-success");
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }  
  };

  // 各入力フィールドにはonChangeイベントがあり、ユーザーの入力をローカルステートに保存
  return (
    <>
      <form noValidate autoComplete="off">
      {/* off = 過去に入力された値が自動的に表示されるのを防ぐ等 */}
        <Card
          sx={{
            marginTop: 6,
            padding: 2,
            maxWidth: 400
          }}
        >
          <CardHeader
            sx={{
              textAlign: "center"
            }}
            title="Sign Up"
          />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Name"
              value={name}
              margin="dense"
              onChange={event => setName(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email"
              value={email}
              margin="dense"
              onChange={event => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              margin="dense"
              placeholder="At least 6 characters"
              autoComplete="current-password"
              onChange={event => setPassword(event.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password Confirmation"
              type="password"
              value={passwordConfirmation}
              margin="dense"
              autoComplete="current-password"
              onChange={event => setPasswordConfirmation(event.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={
                !name || !email || !password || !passwordConfirmation ? true : false
              }
              sx={{
                mt: 2,
                flexGrow: 1,
                textTransform: "none"
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage  // エラーが発生した場合は下記のpropsに従いアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Invalid emai or password"
      />
    </>
  );
};

export default SignUp;
