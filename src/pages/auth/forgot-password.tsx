import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import ForgotPasswordView from 'src/sections/auth/forgot-password-view';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Ceylon Reload - Reset Password</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
