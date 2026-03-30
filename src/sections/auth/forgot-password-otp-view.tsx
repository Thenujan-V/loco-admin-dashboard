import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { Alert } from '@mui/material';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { useVerifyOtpInForgotMutation } from 'src/store/auth/forgot-password';
import { useResendOtpMutation } from 'src/store/auth/auth-api';
import { getOrCreateDeviceId } from 'src/utils/device';
import PasswordIcon from 'src/assets/icons/password-icon';
import { useSnackbar } from 'notistack';
// import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function ForgotPasswordOtpView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const searchParams = useSearchParams();

  const mobile = searchParams.get('mobile');

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

  const [SendOTP] = useVerifyOtpInForgotMutation();
  const [ResendOtp] = useResendOtpMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
  });

  const defaultValues = {
    code: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
      const body =
      {
        phoneNumber: mobile || '',
        otpCode: data.code
      }

      const response= await SendOTP(body).unwrap();
      router.pushData(paths.auth.resetPW, { Authorization: response.content.resetToken  });

    } catch (error: any) {
      setErrorMsg(error.data.message);
    }
  });


  const handleResendCode = useCallback(async () => {
    try {
      const deviceId = getOrCreateDeviceId();
      startCountdown();
      await ResendOtp({username:mobile,deviceId:deviceId}).unwrap();
      enqueueSnackbar('Resend OTP success!',{ variant: 'success' });
    } catch (error: any) {
      setErrorMsg(error.data.message);
    }
  }, [startCountdown, ResendOtp, mobile, enqueueSnackbar]);
  



  const renderForm = (
    <Stack spacing={3} sx={{ my: 3 }} alignItems="center">

      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verify
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          onClick={handleResendCode}
          sx={{
            cursor: 'pointer',
            ...(counting && {
              color: 'text.disabled',
              pointerEvents: 'none',
            }),
          }}
        >
          Resend code {counting && `(${countdown}s)`}
        </Link>
      </Typography>

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
        Return to login
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <Stack direction="column" spacing={1} alignItems="center" justifyContent='center'>
        {/* <Logo sx={{ width: 45, height: 45 }} /> */}
        <PasswordIcon sx={{ height: 96 }} />
        <Typography variant="h4" sx={{py:1,textAlign:'center'}}>Reset Password - OTP Verification</Typography>
      </Stack>

      <Stack spacing={1} sx={{ my: 1.5 }}>
        {/* <Typography variant="h5">OTP Verification</Typography> */}

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          We&apos;ve sent a 6-digit verification code to your mobile {mobile}
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
