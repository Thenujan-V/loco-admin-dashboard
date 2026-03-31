import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'src/routes/hooks';
import SchedulingDetailsView from 'src/sections/train-schedule/scheduling/view/scheduling-details-view';

export default function SchedulingDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Schedule Overview</title>
      </Helmet>
      
      <SchedulingDetailsView id={id as string} />
    </>
  );
}
