import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  package: icon('ic_package'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      {
        items: [
          { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Users', path: paths.dashboard.users.root, icon: ICONS.user },
          { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.order },
          {
            title: 'Menu',
            path: paths.dashboard.menu.root,
            icon: ICONS.menuItem,
            children: [
              { title: 'Categories', path: paths.dashboard.menu.categories },
              { title: 'Items', path: paths.dashboard.menu.items },
            ],
          },
          {
            title: 'Train Info',
            path: paths.dashboard.trainInfo.root,
            icon: ICONS.tour,
            children: [
              { title: 'Stations', path: paths.dashboard.trainInfo.stations },
              { title: 'Lines', path: paths.dashboard.trainInfo.lines },
              { title: 'Routes', path: paths.dashboard.trainInfo.routes },
              { title: 'Trains', path: paths.dashboard.trainInfo.trains },

            ],
          },
          {
            title: 'Train Schedule',
            path: paths.dashboard.trainSchedule.root,
            icon: ICONS.calendar,
            children: [
              { title: 'Scheduling', path: paths.dashboard.trainSchedule.scheduling },
            ],
          },
          {
            title: 'Restaurants',
            path: paths.dashboard.restaurants.list,
            icon: ICONS.tour,
          },
          {
            title: 'Pickup Person',
            path: paths.dashboard.pickupPerson.list,
            icon: ICONS.user,
          },
          {
            title: 'Delivery Person',
            path: paths.dashboard.deliveryPerson.list,
            icon: ICONS.tour,
          },
          {
            title: 'Foods',
            path: paths.dashboard.foods.root,
            icon: ICONS.ecommerce,
            children: [
              { title: 'Categories', path: paths.dashboard.foods.categories },
              { title: 'Default Items', path: paths.dashboard.foods.defaultItems },
            ],
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'management',
      //   items: [
      //     {
      //       title: 'user',
      //       path: paths.dashboard.group.root,
      //       icon: ICONS.user,
      //     },
      //   ],
      // },
    ],
    []
  );

  return data;
}
