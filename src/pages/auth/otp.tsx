import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import { OtpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function OtpPage() {
  return (
    <>
      <Helmet>
        <title> Ceylon Reload - OTP</title>
      </Helmet>

      <OtpView />
    </>
  );
}
