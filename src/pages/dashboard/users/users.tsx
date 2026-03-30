import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import UserListView from 'src/sections/users/view/user-list-view';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Users</title>
      </Helmet>

      <UserListView />
    </>
  );
}
