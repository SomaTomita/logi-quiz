import { useState, useContext } from "react";
import Cookies from "js-cookie";

import { TextField, Card, CardContent, CardHeader, Button, Alert}  from "@mui/material";

import { AuthContext } from "App";
import AlertMessage from "../utils/alertMessage";
import { signUp } from "../api/auth";
import { SignUpParams } from "../interfaces";

// サインアップ用ページ
const SignUp = () => {

  const { setIsSignedIn, setCurrentUser, setIsAdmin } = useContext(AuthContext);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const confirmSuccessUrl = process.env.REACT_APP_CONFIRM_SUCCESS_URL;


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const params: SignUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
      confirmSuccessUrl: confirmSuccessUrl,
    };
  
    try {
      const res = await signUp(params);

      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);
        setIsAdmin(res?.data.data.admin);

        <Alert onClose={() => {}}>This is a success alert — check your email!</Alert>
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }  
  };

  
  return (
    <>
      <form noValidate autoComplete="off">
        <Card sx={{ marginTop: 6, padding: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: "center" }}
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

            <Button type="submit" variant="contained" size="large" fullWidth
              disabled={ !name || !email || !password || !passwordConfirmation ? true : false }
              sx={{ mt: 2, flexGrow: 1, textTransform: "none" }}
              onClick={handleSubmit}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Invalid emai or password"
      />
    </>
  );
};

export default SignUp;
