import { Helmet } from '@dr.pogodin/react-helmet';
import StationListView from 'src/sections/train-info/stations/view/station-list-view';

export default function StationsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Stations</title>
      </Helmet>
      <StationListView />
    </>
  );
}
