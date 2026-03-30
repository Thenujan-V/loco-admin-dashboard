import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
// config
// import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { EmailInboxIcon } from 'src/assets/icons';


// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { sendOtp } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\+?[0-9]{10,15}$/, 'Mobile Number must be valid'),

    password: Yup.string()
      .required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await sendOtp?.(data.phoneNumber, data.password);

      const searchParams = new URLSearchParams({
        mobile: data.phoneNumber,
      }).toString();

      const href = `${paths.auth.otp}?${searchParams}`;

      router.push(href);
    } catch (error:any) {
      setErrorMsg(error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, textAlign:'center' }}>
      <Typography variant="h4">Log in to your Account</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary'}} noWrap>
      Welcome back! Please enter your details.
      </Typography>


    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="phoneNumber" label="Mobile Number" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link variant="body2" component={RouterLink} href={paths.auth.forgotPW} color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </Button>
      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        {/* <EmailInboxIcon sx={{ height: 96 }} /> */}

      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
