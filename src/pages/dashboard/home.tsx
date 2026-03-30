import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import Home from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Dashboard</title>
      </Helmet>

      <Home />
    </>
  );
}
