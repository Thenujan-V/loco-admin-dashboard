import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/dashboard'));

const UsersPage = lazy(() => import('src/pages/dashboard/users/users'));
const OrdersPage = lazy(() => import('src/pages/dashboard/orders/orders'));
const UserDetailsPage = lazy(() => import('src/pages/dashboard/users/details'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/orders/details'));
const CategoriesPage = lazy(() => import('src/pages/dashboard/menu/categories/categories'));
const ItemsPage = lazy(() => import('src/pages/dashboard/menu/items/items'));
const StationsPage = lazy(() => import('src/pages/dashboard/train-info/stations/stations'));
const TrainsPage = lazy(() => import('src/pages/dashboard/train-info/trains/trains'));
const RoutesPage = lazy(() => import('src/pages/dashboard/train-info/routes/routes'));
const LinesPage = lazy(() => import('src/pages/dashboard/train-info/lines/lines'));
const LineDetailsPage = lazy(() => import('src/pages/dashboard/train-info/lines/details'));
const SchedulingPage = lazy(() => import('src/pages/dashboard/train-schedule/scheduling/scheduling'));
const SchedulingDetailsPage = lazy(() => import('src/pages/dashboard/train-schedule/scheduling/details'));
const StationStopsPage = lazy(() => import('src/pages/dashboard/train-schedule/station-stops/station-stops'));

const RestaurantListPage = lazy(() => import('src/pages/dashboard/restaurants/list'));
const RestaurantDetailsPage = lazy(() => import('src/pages/dashboard/restaurants/details'));

const PickupPersonListPage = lazy(() => import('src/pages/dashboard/pickup-person/list'));
const PickupPersonDetailsPage = lazy(() => import('src/pages/dashboard/pickup-person/details'));

const DeliveryPersonListPage = lazy(() => import('src/pages/dashboard/delivery-person/list'));
const DeliveryPersonDetailsPage = lazy(() => import('src/pages/dashboard/delivery-person/details'));

const FoodCategoriesPage = lazy(() => import('src/pages/dashboard/foods/categories/categories'));
const FoodDefaultItemsPage = lazy(() => import('src/pages/dashboard/foods/default-items/default-items'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'users',
        children: [
          { element: <UsersPage />, index: true },
          { path: ':id', element: <UserDetailsPage /> },
        ],
      },
      {
        path: 'orders',
        children: [
          { element: <OrdersPage />, index: true },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'menu',
        children: [
          { path: 'categories', element: <CategoriesPage /> },
          { path: 'items', element: <ItemsPage /> },
        ],
      },
      {
        path: 'train-info',
        children: [
          { path: 'stations', element: <StationsPage /> },
          { path: 'trains', element: <TrainsPage /> },
          { path: 'routes', element: <RoutesPage /> },
          { path: 'lines', element: <LinesPage /> },
          { path: 'lines/:id', element: <LineDetailsPage /> },
        ],
      },
      {
        path: 'train-schedule',
        children: [
          { element: <SchedulingPage />, index: true },
          { path: 'scheduling', element: <SchedulingPage /> },
          { path: 'scheduling/:id', element: <SchedulingDetailsPage /> },
          { path: 'station-stops', element: <StationStopsPage /> },
        ],
      },
      {
        path: 'restaurants',
        children: [
          { element: <RestaurantListPage />, index: true },
          { path: 'list', element: <RestaurantListPage /> },
          { path: ':id', element: <RestaurantDetailsPage /> },
        ],
      },
      {
        path: 'pickup-person',
        children: [
          { element: <PickupPersonListPage />, index: true },
          { path: 'list', element: <PickupPersonListPage /> },
          { path: ':id', element: <PickupPersonDetailsPage /> },
        ],
      },
      {
        path: 'delivery-person',
        children: [
          { element: <DeliveryPersonListPage />, index: true },
          { path: 'list', element: <DeliveryPersonListPage /> },
          { path: ':id', element: <DeliveryPersonDetailsPage /> },
        ],
      },
      {
        path: 'foods',
        children: [
          { element: <FoodCategoriesPage />, index: true },
          { path: 'categories', element: <FoodCategoriesPage /> },
          { path: 'default-items', element: <FoodDefaultItemsPage /> },
        ],
      },
    ],
  },
];
