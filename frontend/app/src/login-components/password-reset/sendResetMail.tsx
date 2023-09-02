import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { TextField, Card, CardContent, CardHeader, Button, Alert, Typography, IconButton } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

import { PasswordReset, SendResetMailType } from './passwordAuth';
import AlertMessage from "../utils/alertMessage";

const SendResetMail: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const { register, formState: { errors }, handleSubmit, watch } = useForm<SendResetMailType>({ criteriaMode: 'all' });

  // email の値を監視する
  const watchedEmail = watch("email");

  const onSubmit: SubmitHandler<SendResetMailType> = async (data) => {
    try {
      const response = await PasswordReset.sendEmail(data);
      setIsSubmitted(true);
    } catch (err) {
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
        Reset email sent
      </Typography>
    </Alert>
  );

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ marginTop: 6, padding: 2, maxWidth: 450 }}>
          <CardHeader sx={{ textAlign: "center" }} title="Reset Password" />
          <CardContent>
            <TextField variant="outlined" required fullWidth 
              label="Email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email && errors.email.message}
              margin="dense"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!watchedEmail || Boolean(errors.email)} // email が空またはエラーが存在する場合にボタンを無効にする
              sx={{ mt: 2, flexGrow: 1, textTransform: "none" }}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="Failed to send email"
      />
    </>
  );
};

export default SendResetMail;