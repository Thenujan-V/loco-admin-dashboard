import { Helmet } from '@dr.pogodin/react-helmet';
// sections
import CategoryListView from 'src/sections/menu/categories/view/category-list-view';

// ----------------------------------------------------------------------

export default function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Menu Categories</title>
      </Helmet>

      <CategoryListView />
    </>
  );
}
