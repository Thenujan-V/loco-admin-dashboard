import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'src/routes/hooks';
import RestaurantDetailsView from 'src/sections/restaurants/view/restaurant-details-view';

export default function RestaurantDetailsPage() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Restaurant Overview</title>
      </Helmet>
      
      <RestaurantDetailsView id={id as string} />
    </>
  );
}
