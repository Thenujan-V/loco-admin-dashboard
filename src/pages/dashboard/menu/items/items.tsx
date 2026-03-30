import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import ItemListView from 'src/sections/menu/items/view/item-list-view';

// ----------------------------------------------------------------------

export default function ItemsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Menu Items</title>
      </Helmet>

      <ItemListView />
    </>
  );
}
