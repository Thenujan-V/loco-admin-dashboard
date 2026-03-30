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
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { getOrCreateDeviceId } from 'src/utils/device';
// import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function OtpView() {
  const { verifyOtpCode, ResendOtp } = useAuthContext();

  const router = useRouter();

  const searchParams = useSearchParams();

  const mobile = searchParams.get('mobile');

  const returnTo = searchParams.get('returnTo');

  const { countdown, counting, startCountdown } = useCountdownSeconds(60);

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

      await verifyOtpCode(data.code, mobile);

      router.push(returnTo || PATH_AFTER_LOGIN);

    } catch (error:any) {
      setErrorMsg(error.message);
    }
  });


  const handleResendCode = useCallback(async () => {
    try {
      startCountdown();
      await ResendOtp(mobile, getOrCreateDeviceId());
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  }, [mobile, ResendOtp, startCountdown, setErrorMsg]);
  
  

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
      <Stack direction="row" spacing={1} alignItems="center" justifyContent='center'>
        {/* <Logo sx={{ width: 45, height: 45 }} /> */}
        <Typography variant="h4">OTP Verification</Typography>
      </Stack>

      <Stack spacing={1} sx={{ my: 1.5 }}>
        {/* <Typography variant="h5">OTP Verification</Typography> */}

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign:'center' }}>
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
