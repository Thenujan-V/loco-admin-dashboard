import { Helmet } from '@dr.pogodin/react-helmet';
import LineListView from 'src/sections/train-info/lines/view/line-list-view';

export default function LinesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Lines</title>
      </Helmet>
      <LineListView />
    </>
  );
}
