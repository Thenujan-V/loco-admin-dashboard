import { Helmet } from '@dr.pogodin/react-helmet';
import TrainListView from 'src/sections/train-info/trains/view/train-list-view';

export default function TrainsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Trains</title>
      </Helmet>
      <TrainListView />
    </>
  );
}
