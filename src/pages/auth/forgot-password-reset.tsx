import { Helmet } from '@dr.pogodin/react-helmet';
import NewPasswordView from 'src/sections/auth/new-password-view';
// sections

// ----------------------------------------------------------------------

export default function ForgotPasswordResetPage() {
  return (
    <>
      <Helmet>
        <title> Ceylon Reload - Reset Password</title>
      </Helmet>

      <NewPasswordView/>
    </>
  );
}
