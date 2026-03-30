import { Helmet } from '@dr.pogodin/react-helmet';
import { DashboardView } from 'src/sections/dashboard/view';
// sections


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Ceylon Reload - Dashboard</title>
      </Helmet>

      <DashboardView />
    </>
  );
}
