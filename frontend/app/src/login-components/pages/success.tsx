import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "App";


import { Container, Typography, Alert, IconButton, CircularProgress, } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Success = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (isSignedIn && currentUser) {
      setTimeout(() => {
        navigate("/home");
      }, 3500);
    }
  }, [isSignedIn]);


  return (
    <Container component="main" maxWidth="xs" sx={{ textAlign: "center", marginTop: "50px" }}>
      {isSignedIn && currentUser ? (
        <>
          <Alert 
            severity="success" 
            action={
              <IconButton color="inherit" size="small">
                <CheckCircleIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
          >
            <Typography variant="h4">
              Signed in successfully!
            </Typography>
          </Alert>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
            Email: {currentUser?.email}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: 5 }}>
            Name: {currentUser?.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 5 }}>
            Go to the Home screen soon...
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
    </Container>
  );
};

export default Success;
