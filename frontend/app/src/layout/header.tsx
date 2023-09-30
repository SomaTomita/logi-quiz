import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

import { signOut } from "../login-components/api/auth";
import { AuthContext } from "App";

const AppBarContent = styled('div')(({ theme }) => ({
  maxWidth: "1200px",
  marginLeft: "auto",
  marginRight: "auto",
  width: '100%',
  [theme.breakpoints.down("md")]: {
    maxWidth: "960px",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "728px",
  }
}));


const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn, isAdmin } = useContext(AuthContext);  // AuthContextから必要なステートと関数を取得
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut();

      if (res.data.success === true) {
        Cookies.remove("_access_token");
        Cookies.remove("_client");
        Cookies.remove("_uid");

        setIsSignedIn(false); // サインイン状態を解除
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
      if (isAdmin) {
        return (
          <>
            <Button component={Link} to="/create-quiz" color="inherit" sx={{ textTransform: "none" }}>
              Create Quiz
            </Button>
            <Button component={Link} to="/create-section" color="inherit" sx={{ textTransform: "none" }}>
              Create Section
            </Button>
            <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        );
      } else if (isSignedIn) {
        return (
          <>
            <Button component={Link} to="/sections" color="inherit" sx={{ textTransform: "none" }}>
              Sections
            </Button>
            <Button component={Link} to="/dashboard" color="inherit" sx={{ textTransform: "none" }}>
              DashBoard
            </Button>
            <Button href="https://forms.gle/RxFuJeaLW65w4pg48" color="inherit" sx={{ textTransform: "none" }} onClick={handleSignOut}>
              Contact
            </Button>
            <Button color="inherit" sx={{ textTransform: "none" }} onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        );
      } else {
        return (
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
      return <></>;
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', overflow: 'hidden'}}>
        <AppBarContent>
          <Toolbar>
            <DirectionsBoatIcon sx={{ marginRight: 1.5 }}></DirectionsBoatIcon>
            <Typography component={Link} to="/home" 
                        variant="h6" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
              国際物流クイズ
            </Typography>
            <HeaderButtons />
          </Toolbar>
        </AppBarContent>
      </AppBar>
    </>
  );
};

export default Header;