import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import { Typography, TextField, Card, CardContent, CardHeader, Button, Box } from "@mui/material";

import { AuthContext } from "App";
import AlertMessage from "../utils/alertMessage";
import { signIn } from "../api/auth";
import { SignInParams } from "../interfaces";

// サインイン用ページ
const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const { setIsSignedIn, setCurrentUser, setIsAdmin } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => { // <button>要素のマウスイベントとして発火
    e.preventDefault();


    // ユーザーのログイン情報を使ってサインイン
    const params: SignInParams = { //変数paramsの型をinterfacesで定義したSignInParamsとして定義
      email: email,
      password: password,
    };

    try {
      const res = await signIn(params);
  
      if (res.status === 200) {  // サーバーからのレスポンスのヘッダーにある認証情報をCookieにセット
        // 第一引数の特定のクッキーの名前（キー）に、第二引数のクッキーの値を関連付けて保存
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        setIsAdmin(res?.data.data.admin);

        navigate("/confirmation-success");
        console.log("Signed in successfully!");
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      setAlertMessageOpen(true); // APIコールでエラーが発生した場合もアラートを表示
    }
  };

  return (
    // CardHeader、CardContentを使ってCardの構成
    <>
      <form noValidate autoComplete="off"> 
      {/* off = 過去に入力された値が自動的に表示されるのを防ぐ等 */}
        <Card sx={{ padding: (theme) => theme.spacing(2), maxWidth: 450 }}>
          <CardHeader title="Sign In" sx={{ textAlign: "center" }} />
          <CardContent>
            <TextField variant="outlined"
              required  // このフィールドは必須であることを示す
              fullWidth
              label="Email"
              value={email}
              margin="dense"  // テキストフィールドの周りのマージンが通常よりも少し少なくなる
              onChange={(event) => setEmail(event.target.value)} // 入力に応じて反映
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              margin="dense"
              autoComplete="current-password" // ブラウザの自動完了機能を利用して、現在のパスワードを提案
              onChange={(event) => setPassword(event.target.value)}
            />

            <Box textAlign="right" sx={{ mt: 1 }}>
            <Link to="/auth/password" style={{ fontSize: '0.8rem', textDecoration: 'none', color: 'blue', }}>
              Forget your Password?
            </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!email || !password} // emailまたはpasswordが空の場合、ボタンを無効化
              sx={{ marginTop: (theme) => theme.spacing(2), flexGrow: 1, 
                textTransform: "none", // ボタンのテキスト変換を無効にする（大文字変換などを防ぐ）
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Box textAlign="center" sx={{marginTop: "2rem" }}>
              <Typography variant="body1" sx={{ marginTop: 4,}}>
                Don't have an account? &nbsp;
                <Box component={Link} to="/signup" sx={{ textDecoration: "none", color: 'blue', }}>
                Sign Up now!
                </Box>
              </Typography>
            </Box>
            <Box textAlign="center" sx={{marginTop: "2rem" }}>
              <Typography variant="body1" sx={{ marginTop: 4,}}>
                Play without login? &nbsp;
                <Box component={Link} to="/home" sx={{ textDecoration: "none", color: 'blue', }}>
                Let's play quiz now!
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
      <AlertMessage  // エラーが発生した場合は下記のpropsに従いアラートを表示
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Invalid email or password" // アラートに表示する具体的なメッセージ
      />
    </>
  );
};

export default SignIn;