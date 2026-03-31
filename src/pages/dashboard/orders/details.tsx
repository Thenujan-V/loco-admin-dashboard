import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'react-router-dom';

import OrderDetailsView from 'src/sections/orders/view/order-details-view';

export default function OrderDetailsPage() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> Dashboard: Order Details</title>
      </Helmet>

      <OrderDetailsView id={id} />
    </>
  );
}
