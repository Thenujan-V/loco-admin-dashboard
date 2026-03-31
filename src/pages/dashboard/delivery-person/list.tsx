import { Helmet } from '@dr.pogodin/react-helmet';
import DeliveryPersonListView from 'src/sections/delivery-person/view/delivery-person-list-view';

export default function DeliveryPersonListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Delivery Person List</title>
      </Helmet>
      <DeliveryPersonListView />
    </>
  );
}
