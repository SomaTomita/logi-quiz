import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import { signOut } from "../api/auth";
import { AuthContext } from "App";

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);  // AuthContextから必要なステートと関数を取得
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) { // サインアウトが成功した場合 signInまたはUpでsetしたCookieを削除
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false);
        navigate("/signin");
        console.log("Succeeded in sign out");
      } else {
        console.log("Failed in sign out");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 認証状態に基づいてヘッダーのボタンを変更
  const HeaderButtons = () => {
    if (!loading) {
      if (isSignedIn) { // サインイン済状態
        return (
          <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleSignOut}>
            Sign out
          </Button>
        );
      } else {
        return ( // サインインしていない状態
          <>
            <Button component={Link} to="/signin" color="inherit" sx={{ textTransform: "none" }}>
              Sign in
            </Button>
            <Button component={Link} to="/signup" color="inherit" sx={{ textTransform: "none" }}>
              Sign Up
            </Button>
          </>
        );
      }
    } else {
      return <></>; // ロード中は何も表示しない
    }
  };
  // ヘッダーのUI
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
            貿易クイズ
          </Typography>
          <HeaderButtons />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
