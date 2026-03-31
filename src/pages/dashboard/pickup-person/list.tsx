import { Helmet } from '@dr.pogodin/react-helmet';
import PickupPersonListView from 'src/sections/pickup-person/view/pickup-person-list-view';

export default function PickupPersonListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Pickup Person List</title>
      </Helmet>
      <PickupPersonListView />
    </>
  );
}
