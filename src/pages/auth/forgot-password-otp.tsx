import { Helmet } from '@dr.pogodin/react-helmet';
import ForgotPasswordOtpView from 'src/sections/auth/forgot-password-otp-view';
// sections

// ----------------------------------------------------------------------

export default function ForgotPasswordOtpPage() {
  return (
    <>
      <Helmet>
        <title> Loco Munch - Reset Password</title>
      </Helmet>

      <ForgotPasswordOtpView/>
    </>
  );
}
