import { Helmet } from '@dr.pogodin/react-helmet';
import RouteListView from 'src/sections/train-info/routes/view/route-list-view';

export default function RoutesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Routes</title>
      </Helmet>
      <RouteListView />
    </>
  );
}
