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
const CategoriesPage = lazy(() => import('src/pages/dashboard/menu/categories/categories'));
const ItemsPage = lazy(() => import('src/pages/dashboard/menu/items/items'));
const StationsPage = lazy(() => import('src/pages/dashboard/train-info/stations/stations'));
const TrainsPage = lazy(() => import('src/pages/dashboard/train-info/trains/trains'));
const RoutesPage = lazy(() => import('src/pages/dashboard/train-info/routes/routes'));
const LinesPage = lazy(() => import('src/pages/dashboard/train-info/lines/lines'));
const LineStationsPage = lazy(() => import('src/pages/dashboard/train-info/line-stations/line-stations'));
const SchedulingPage = lazy(() => import('src/pages/dashboard/train-schedule/scheduling/scheduling'));
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
        ],
      },
      {
        path: 'orders',
        children: [
          { element: <OrdersPage />, index: true },
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
          { path: 'line-stations', element: <LineStationsPage /> },
        ],
      },
      {
        path: 'train-schedule',
        element: <SchedulingPage />,
      },
    ],
  },
];
