import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import { RegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>

      <RegisterView />
    </>
  );
}
