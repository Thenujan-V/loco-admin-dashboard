import { Helmet } from '@dr.pogodin/react-helmet';
import FoodCategoryListView from 'src/sections/foods/categories/view/food-category-list-view';

export default function FoodCategoriesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Food Categories</title>
      </Helmet>
      <FoodCategoryListView />
    </>
  );
}
