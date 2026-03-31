import { Helmet } from '@dr.pogodin/react-helmet';
import { DashboardView } from 'src/sections/dashboard/view';
// sections


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Loco Munch - Dashboard</title>
      </Helmet>

      <DashboardView />
    </>
  );
}
