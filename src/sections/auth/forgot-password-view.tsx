import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// assets
import { PasswordIcon } from 'src/assets/icons';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useRequestOtpMutation } from 'src/store/auth/forgot-password';
import { useState } from 'react';
import { Alert } from '@mui/material';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const [RequestOTP] = useRequestOtpMutation();
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\+?[0-9]{10,15}$/, 'Mobile Number must be valid'),
  });

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        "phoneNumber": data.phoneNumber,
      };
      await RequestOTP(body).unwrap();
      const searchParams = new URLSearchParams({
        mobile: data.phoneNumber,
      }).toString();
      const href = `${paths.auth.forgotPWOTP}?${searchParams}`;
      router.push(href);
    } catch (error: any) {
      setErrorMsg(error?.data.message)
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <RHFTextField name="phoneNumber" label="Mobile Number" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        Send OTP
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <PasswordIcon sx={{ height: 80 }} />

      <Stack spacing={1} sx={{ my: 1 }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "center" }}>
          Please enter the phone number associated with your account and We will send you a OTP
          to reset your password.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}
