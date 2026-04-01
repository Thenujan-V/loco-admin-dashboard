import { Helmet } from '@dr.pogodin/react-helmet';
import SchedulingListView from 'src/sections/train-schedule/scheduling/view/scheduling-list-view';

export default function SchedulingPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Train Schedule</title>
      </Helmet>
      <SchedulingListView />
    </>
  );
}
