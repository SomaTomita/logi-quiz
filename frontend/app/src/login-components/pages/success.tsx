import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Paper, Typography, CircularProgress } from "@mui/material";

import { AuthContext } from "App";


const Success: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);  // AuthContextからisSignedInとcurrentUserの情報を取得
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && currentUser) { // サインインしていて、currentUserが存在する場合3.5秒でセクション画面に遷移
      setTimeout(() => {
        navigate("/home");
      }, 3500);
    }
  }, [isSignedIn]); // ユーザーのログインを判別するステートが更新された際に遷移

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center", marginTop: "50px" }}>
        {isSignedIn && currentUser ? (
          <>
            <Typography variant="h4" gutterBottom>
              Signed in successfully!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {currentUser?.email}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Name: {currentUser?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Go to the home screen shortly...
            </Typography>
            <div style={{ marginTop: "20px" }}>
              <CircularProgress />
            </div>
          </>
        ) : (
          <Typography variant="h4" color="error">
            Not signed in
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Success;