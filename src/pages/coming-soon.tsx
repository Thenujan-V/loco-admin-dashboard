import { Helmet } from '@dr.pogodin/react-helmet';

// sections
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function ComingSoonPage() {
  return (
    <>
      <Helmet>
        <title> Coming Soon</title>
      </Helmet>

      <ComingSoonView />
    </>
  );
}
