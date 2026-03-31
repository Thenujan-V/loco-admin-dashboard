import { Helmet } from '@dr.pogodin/react-helmet';
import FoodDefaultItemListView from 'src/sections/foods/default-items/view/default-item-list-view';

export default function FoodDefaultItemsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Default Food Items</title>
      </Helmet>
      <FoodDefaultItemListView />
    </>
  );
}
