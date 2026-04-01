import { Helmet } from '@dr.pogodin/react-helmet';
import { useParams } from 'src/routes/hooks';

import LineDetailsView from 'src/sections/train-info/lines/view/line-details-view';

export default function LineDetailsPage() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title> Dashboard: Line Details</title>
      </Helmet>
      <LineDetailsView id={id} />
    </>
  );
}
