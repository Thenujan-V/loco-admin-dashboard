import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'src/routes/hooks';
import PickupPersonDetailsView from 'src/sections/pickup-person/view/pickup-person-details-view';

export default function PickupPersonDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Pickup Person Overview</title>
      </Helmet>
      
      <PickupPersonDetailsView id={id as string} />
    </>
  );
}
