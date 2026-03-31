import { Helmet } from '@dr.pogodin/react-helmet';
import LineStationListView from 'src/sections/train-info/line-stations/view/line-station-list-view';

export default function LineStationsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Line Stations</title>
      </Helmet>
      <LineStationListView />
    </>
  );
}
