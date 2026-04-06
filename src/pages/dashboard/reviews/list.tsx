import { Helmet } from '@dr.pogodin/react-helmet';

import ReviewListView from 'src/sections/reviews/view/review-list-view';

export default function ReviewListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Reviews</title>
      </Helmet>

      <ReviewListView />
    </>
  );
}
