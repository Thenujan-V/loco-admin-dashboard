import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import { LoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <LoginView />
    </>
  );
}
