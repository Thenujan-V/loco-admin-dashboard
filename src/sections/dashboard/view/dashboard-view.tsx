import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useSettingsContext } from 'src/components/settings';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { MOCK_RESTAURANTS } from 'src/sections/restaurants/view/restaurant-list-view';
import { MOCK_PICKUP_PERSONS } from 'src/sections/pickup-person/view/pickup-person-list-view';
import { MOCK_DELIVERY_PERSONS } from 'src/sections/delivery-person/view/delivery-person-list-view';
import { MOCK_USERS, MOCK_ORDERS } from 'src/sections/users/user-mock-data';
import { MOCK_TRAINS, MOCK_ROUTES } from 'src/sections/train-schedule/scheduling/scheduling-add-edit-dialog';
import { MOCK_SCHEDULES } from 'src/sections/train-schedule/station-stops/station-stop-add-edit-dialog';
import { useGetLinesQuery, normalizeLinesResponse } from 'src/store/lines/line-api';
import { useGetStationsQuery, normalizeStationsResponse } from 'src/store/stations/station-api';

const BRAND = {
  primary: '#FF5A1F',
  secondary: '#FEEDE6',
  background: '#F5F5F5',
  white: '#FFFFFF',
  gray: '#D9D9D9',
  text: '#333333',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'default',
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const colorMap = {
    default: { bg: BRAND.secondary, color: BRAND.primary },
    success: { bg: '#fff1eb', color: '#d94710' },
    warning: { bg: '#ffe4da', color: '#c2410c' },
  } as const;

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        bgcolor: BRAND.white,
        border: `1px solid ${BRAND.gray}`,
        boxShadow: '0 18px 40px rgba(51, 51, 51, 0.06)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="overline" sx={{ color: BRAND.primary }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, color: BRAND.text }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)', mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: colorMap[tone].bg,
            color: colorMap[tone].color,
          }}
        >
          <Iconify icon={icon} width={24} />
        </Box>
      </Stack>
    </Card>
  );
}

export default function DashboardView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { data: linesData } = useGetLinesQuery();
  const { data: stationsData } = useGetStationsQuery();
  const lineCount = normalizeLinesResponse(linesData).length || 2;
  const stationCount = normalizeStationsResponse(stationsData).length || 2;

  const stats = useMemo(() => {
    const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + order.totalAmount, 0);
    const deliveredOrders = MOCK_ORDERS.filter((order) => order.status === 'DELIVERED').length;
    const pendingVerifications =
      MOCK_RESTAURANTS.filter((item) => item.status === 'PENDING').length +
      MOCK_PICKUP_PERSONS.filter((item) => item.status === 'PENDING').length +
      MOCK_DELIVERY_PERSONS.filter((item) => item.status === 'PENDING').length +
      MOCK_USERS.filter((item) => !item.isVerified).length;

    const activeUsers = MOCK_USERS.filter((item) => item.isActive).length;
    const activeVendors =
      MOCK_RESTAURANTS.filter((item) => item.isActive).length +
      MOCK_PICKUP_PERSONS.filter((item) => item.isActive).length +
      MOCK_DELIVERY_PERSONS.filter((item) => item.isActive).length;

    return {
      totalRevenue,
      deliveredOrders,
      pendingVerifications,
      activeUsers,
      activeVendors,
    };
  }, []);

  const verificationQueue = useMemo(
    () => [
      ...MOCK_RESTAURANTS.filter((item) => item.status === 'PENDING').map((item) => ({
        id: item.id,
        name: item.name,
        type: 'Restaurant',
        path: paths.dashboard.restaurants.details(String(item.id)),
      })),
      ...MOCK_PICKUP_PERSONS.filter((item) => item.status === 'PENDING').map((item) => ({
        id: item.id,
        name: `${item.firstname} ${item.lastname}`,
        type: 'Pickup Person',
        path: paths.dashboard.pickupPerson.details(String(item.id)),
      })),
      ...MOCK_DELIVERY_PERSONS.filter((item) => item.status === 'PENDING').map((item) => ({
        id: item.id,
        name: `${item.firstname} ${item.lastname}`,
        type: 'Delivery Person',
        path: paths.dashboard.deliveryPerson.details(String(item.id)),
      })),
    ],
    []
  );

  const quickLinks = [
    { title: 'Users', caption: 'Manage users and their orders', path: paths.dashboard.users.list, icon: 'solar:users-group-rounded-bold' },
    { title: 'Orders', caption: 'Open full order timelines', path: paths.dashboard.orders.list, icon: 'solar:bag-smile-bold' },
    { title: 'Restaurants', caption: 'Review vendors and documents', path: paths.dashboard.restaurants.list, icon: 'solar:shop-bold' },
    { title: 'Train Scheduling', caption: 'Control trains, routes, and stops', path: paths.dashboard.trainSchedule.scheduling, icon: 'solar:tram-bold' },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ py: 2, bgcolor: BRAND.background }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 4,
              overflow: 'hidden',
              position: 'relative',
              color: BRAND.text,
              border: `1px solid ${BRAND.gray}`,
              background: `linear-gradient(135deg, ${BRAND.secondary} 0%, ${BRAND.white} 52%, #fff7f3 100%)`,
              boxShadow: '0 20px 50px rgba(255, 90, 31, 0.10)',
            }}
          >
            <Box
              sx={{
                top: -50,
                right: -20,
                width: 220,
                height: 220,
                opacity: 0.8,
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: 'rgba(255, 90, 31, 0.08)',
              }}
            />
            <Box
              sx={{
                bottom: -80,
                right: 120,
                width: 180,
                height: 180,
                opacity: 1,
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: 'rgba(255, 90, 31, 0.12)',
              }}
            />

            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 8 }}>
                <Chip
                  label="Admin Control Center"
                  sx={{
                    mb: 2,
                    color: BRAND.primary,
                    bgcolor: BRAND.white,
                    border: `1px solid ${BRAND.gray}`,
                    backdropFilter: 'blur(6px)',
                  }}
                />
                <Typography variant="h3" sx={{ maxWidth: 680, color: BRAND.text }}>
                  Monitor food delivery, vendors, railway operations, and verification work from one place.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, maxWidth: 720, color: 'rgba(51, 51, 51, 0.78)' }}>
                  With your current data, the dashboard can track live order flow, pending document reviews, active users,
                  vendor performance, and train network readiness.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => router.push(paths.dashboard.orders.list)}
                    endIcon={<Iconify icon="solar:arrow-right-up-bold" />}
                    sx={{
                      bgcolor: BRAND.primary,
                      color: BRAND.white,
                      '&:hover': {
                        bgcolor: '#e24d16',
                      },
                    }}
                  >
                    View Orders
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(paths.dashboard.restaurants.list)}
                    sx={{
                      color: BRAND.primary,
                      borderColor: 'rgba(255, 90, 31, 0.28)',
                      bgcolor: BRAND.white,
                      '&:hover': {
                        borderColor: BRAND.primary,
                        bgcolor: BRAND.secondary,
                      },
                    }}
                  >
                    Review Restaurants
                  </Button>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    p: 3,
                    bgcolor: BRAND.white,
                    border: `1px solid ${BRAND.gray}`,
                    boxShadow: '0 12px 30px rgba(255, 90, 31, 0.08)',
                  }}
                >
                  <Typography variant="overline" sx={{ color: BRAND.primary }}>
                    Network Snapshot
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>Trains</Typography>
                      <Typography variant="subtitle2" sx={{ color: BRAND.text }}>{MOCK_TRAINS.length}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>Routes</Typography>
                      <Typography variant="subtitle2" sx={{ color: BRAND.text }}>{MOCK_ROUTES.length}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>Lines</Typography>
                      <Typography variant="subtitle2" sx={{ color: BRAND.text }}>{lineCount}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>Stations</Typography>
                      <Typography variant="subtitle2" sx={{ color: BRAND.text }}>{stationCount}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>Schedules</Typography>
                      <Typography variant="subtitle2" sx={{ color: BRAND.text }}>{MOCK_SCHEDULES.length}</Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Order Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle={`${MOCK_ORDERS.length} total orders in the current mock dataset`}
            icon="solar:wallet-money-bold"
            tone="default"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Delivered Orders"
            value={String(stats.deliveredOrders)}
            subtitle="Completed orders ready for service-quality review"
            icon="solar:check-circle-bold"
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Pending Verification"
            value={String(stats.pendingVerifications)}
            subtitle="Restaurants, staff, and accounts waiting on admin action"
            icon="solar:shield-warning-bold"
            tone="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Active Footprint"
            value={`${stats.activeUsers + stats.activeVendors}`}
            subtitle={`${stats.activeUsers} active users and ${stats.activeVendors} active operators`}
            icon="solar:pulse-bold"
            tone="default"
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, bgcolor: BRAND.white, border: `1px solid ${BRAND.gray}` }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6">Recent Orders</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>
                  Fast access to the latest order flow, staff assignment, and delivery station.
                </Typography>
              </Box>
              <Button size="small" sx={{ color: BRAND.primary }} onClick={() => router.push(paths.dashboard.orders.list)}>
                See all
              </Button>
            </Stack>

            <TableContainer>
              <Table sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Restaurant</TableCell>
                    <TableCell>Train / Station</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">Open</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_ORDERS.slice(0, 5).map((order) => (
                    <TableRow key={order.orderId} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{order.orderId}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(51, 51, 51, 0.62)' }}>
                          {formatDate(order.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.restaurant.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.trainName}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(51, 51, 51, 0.62)' }}>
                          {order.deliveredStationName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={order.status}
                          color={order.status === 'DELIVERED' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell align="right">
                        <IconButton sx={{ color: BRAND.primary }} onClick={() => router.push(paths.dashboard.orders.details(order.orderId))}>
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, height: '100%', bgcolor: BRAND.white, border: `1px solid ${BRAND.gray}` }}>
            <Typography variant="h6">Verification Queue</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)', mb: 2 }}>
              The next profiles that likely need admin review based on current status.
            </Typography>

            <Stack spacing={1.5}>
              {verificationQueue.map((item) => (
                <Stack
                  key={`${item.type}-${item.id}`}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: BRAND.secondary,
                    border: `1px solid ${BRAND.gray}`,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(51, 51, 51, 0.62)' }}>
                      {item.type}
                    </Typography>
                  </Box>
                  <Button size="small" sx={{ color: BRAND.primary }} onClick={() => router.push(item.path)}>
                    Review
                  </Button>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2">What you can keep adding here</Typography>
            <Stack spacing={1} sx={{ mt: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>
                1. Daily revenue and order trend charts.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>
                2. Top restaurants by completed orders and revenue.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>
                3. Delivery delay alerts by train or station.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)' }}>
                4. Pending verification SLA and admin workload summary.
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ p: 3, height: '100%', bgcolor: BRAND.white, border: `1px solid ${BRAND.gray}` }}>
            <Typography variant="h6">Business Coverage</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)', mb: 2 }}>
              Core supply-side coverage across users, restaurants, and field staff.
            </Typography>

            <Stack spacing={2.5}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2">Users</Typography>
                  <Typography variant="subtitle2">{MOCK_USERS.length}</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: '#f0d8cf', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(stats.activeUsers / MOCK_USERS.length) * 100}%`, height: 1, bgcolor: BRAND.primary }} />
                </Box>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2">Restaurants</Typography>
                  <Typography variant="subtitle2">{MOCK_RESTAURANTS.length}</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: '#f0d8cf', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(MOCK_RESTAURANTS.filter((item) => item.isActive).length / MOCK_RESTAURANTS.length) * 100}%`, height: 1, bgcolor: '#ff7b4a' }} />
                </Box>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2">Pickup Staff</Typography>
                  <Typography variant="subtitle2">{MOCK_PICKUP_PERSONS.length}</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: '#f0d8cf', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(MOCK_PICKUP_PERSONS.filter((item) => item.isActive).length / MOCK_PICKUP_PERSONS.length) * 100}%`, height: 1, bgcolor: '#ff936b' }} />
                </Box>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                  <Typography variant="body2">Delivery Staff</Typography>
                  <Typography variant="subtitle2">{MOCK_DELIVERY_PERSONS.length}</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 99, bgcolor: '#f0d8cf', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(MOCK_DELIVERY_PERSONS.filter((item) => item.isActive).length / MOCK_DELIVERY_PERSONS.length) * 100}%`, height: 1, bgcolor: '#ff6a33' }} />
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3, height: '100%', bgcolor: BRAND.white, border: `1px solid ${BRAND.gray}` }}>
            <Typography variant="h6">Quick Access</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)', mb: 2 }}>
              Jump directly into the modules admins use most often.
            </Typography>

            <Grid container spacing={2}>
              {quickLinks.map((link) => (
                <Grid key={link.title} size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      p: 2.5,
                      height: '100%',
                      cursor: 'pointer',
                      border: `1px solid ${BRAND.gray}`,
                      bgcolor: BRAND.white,
                      boxShadow: 'none',
                      transition: 'transform 160ms ease, box-shadow 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        bgcolor: BRAND.secondary,
                        boxShadow: '0 16px 30px rgba(255, 90, 31, 0.10)',
                      },
                    }}
                    onClick={() => router.push(link.path)}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: BRAND.secondary,
                          color: BRAND.primary,
                        }}
                      >
                        <Iconify icon={link.icon} width={22} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1">{link.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(51, 51, 51, 0.72)', mt: 0.5 }}>
                          {link.caption}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
