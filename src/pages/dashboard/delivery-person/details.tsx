import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'src/routes/hooks';
import DeliveryPersonDetailsView from 'src/sections/delivery-person/view/delivery-person-details-view';

export default function DeliveryPersonDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Delivery Person Overview</title>
      </Helmet>
      
      <DeliveryPersonDetailsView id={id as string} />
    </>
  );
}
