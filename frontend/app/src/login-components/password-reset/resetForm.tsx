import { useState, FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { TextField, Card, CardContent, CardHeader, Button, IconButton, Alert, Typography } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import { PasswordReset, PasswordResetType } from './passwordAuth';
import AlertMessage from "../utils/alertMessage";

type Props = {
  resetPasswordToken: string;
};

const PasswordResetForm: FC<Props> = ({ resetPasswordToken }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const { register, formState: { errors }, handleSubmit, watch } = useForm<PasswordResetType>({ criteriaMode: 'all' });
  const password = watch("password", "");

  const onSubmit: SubmitHandler<PasswordResetType> = async (data) => {
    try {
      await PasswordReset.onReset(data);
      setIsSubmitted(true);
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  if (isSubmitted) return (
    <Alert 
      severity="success" 
      action={
        <IconButton color="inherit" size="small">
          <CheckCircleIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{ mt: 2, display: 'flex', alignItems: 'center' }}
    >
      <Typography variant="h6">
        Reset Password has completed!
      </Typography>
    </Alert>
  );

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginTop: 6, padding: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: "center" }} title="Reset Password" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="New Password"
              type="password"
              {...register('password')}
              error={Boolean(errors.password)}
              helperText={errors.password && "Invalid password"}
              margin="dense"
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="New Password Confirmation"
              type="password"
              {...register('passwordConfirmation')}
              error={Boolean(errors.passwordConfirmation)}
              helperText={errors.passwordConfirmation && "Passwords don't match"}
              margin="dense"
            />
            
           <input type='hidden' 
             value={resetPasswordToken} 
             {...register('resetPasswordToken')} 
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              disabled={!password}
              sx={{ mt: 2, flexGrow: 1, textTransform: "none" }}>
              Change
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Error resetting password"
      />
    </>
  );
};

export default PasswordResetForm;
