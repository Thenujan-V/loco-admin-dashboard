import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'react-router-dom';

import UserDetailsView from 'src/sections/users/view/user-details-view';

export default function UserDetailsPage() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> Dashboard: User Details</title>
      </Helmet>

      <UserDetailsView id={id} />
    </>
  );
}
