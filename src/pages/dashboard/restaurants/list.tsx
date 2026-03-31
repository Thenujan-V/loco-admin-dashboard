import { Helmet } from '@dr.pogodin/react-helmet';
import RestaurantListView from 'src/sections/restaurants/view/restaurant-list-view';

export default function RestaurantListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Restaurants List</title>
      </Helmet>
      <RestaurantListView />
    </>
  );
}
