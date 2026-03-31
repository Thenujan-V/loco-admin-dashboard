import { Helmet } from '@dr.pogodin/react-helmet';
import StationStopListView from 'src/sections/train-schedule/station-stops/view/station-stop-list-view';

export default function StationStopsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Station Stops</title>
      </Helmet>
      <StationStopListView />
    </>
  );
}
