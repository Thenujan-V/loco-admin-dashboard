import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import OrderListView from 'src/sections/orders/view/order-list-view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Orders</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
