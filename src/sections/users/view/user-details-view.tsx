import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import FormControlLabel from '@mui/material/FormControlLabel';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { normalizeUsersResponse, useGetUsersQuery, useToggleUserStatusMutation } from 'src/store/users/user-api';
import { useSnackbar } from 'notistack';

import { getOrdersByUserId, getUserById, OrderRow } from '../user-mock-data';

type Props = {
  id: string;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export default function UserDetailsView({ id }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [currentTab, setCurrentTab] = useState('overview');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActiveValue, setPendingActiveValue] = useState(false);
  const user = useMemo(() => {
    const apiUser = normalizeUsersResponse(data).find((item) => String(item.id) === id);

    if (apiUser) {
      return {
        id: apiUser.id,
        firstname: apiUser.firstname,
        lastname: apiUser.lastname,
        email: apiUser.email,
        phoneNumber: apiUser.phoneNumber,
        isVerified: Boolean(apiUser.isVerified),
        isActive: apiUser.isActive,
        createdAt: apiUser.createdAt || new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(`${apiUser.firstname || 'User'}-${apiUser.id}`)}`,
      };
    }

    return getUserById(id);
  }, [data, id]);

  const orders = useMemo(() => getOrdersByUserId(user.id), [user.id]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.users.list);
  }, [router]);

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleActiveToggleRequest = useCallback((checked: boolean) => {
    setPendingActiveValue(checked);
    setConfirmOpen(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    try {
      await toggleUserStatus({ userId: user.id, isActive: pendingActiveValue }).unwrap();
      enqueueSnackbar(
        `${user.firstname} ${user.lastname} has been ${pendingActiveValue ? 'activated' : 'deactivated'} successfully.`,
        { variant: 'success' }
      );
      setConfirmOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to update user status.', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, pendingActiveValue, toggleUserStatus, user.firstname, user.id, user.lastname]);

  const renderOverview = (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Avatar src={user.avatar} sx={{ width: 88, height: 88 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5">
                {user.firstname} {user.lastname}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                User ID #{user.id}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Label color={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </Label>
                <Label color={user.isActive ? 'success' : 'error'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Label>
              </Stack>
            </Box>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                First Name
              </Typography>
              <Typography variant="body1">{user.firstname}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Last Name
              </Typography>
              <Typography variant="body1">{user.lastname}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Phone Number
              </Typography>
              <Typography variant="body1">{user.phoneNumber}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Created At
              </Typography>
              <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Orders
              </Typography>
              <Typography variant="body1">{orders.length}</Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6">Active Status</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Admin can manually enable or disable this user account here.
          </Typography>

          <FormControlLabel
            sx={{ mt: 3, alignItems: 'flex-start' }}
            control={
              <Switch
                checked={user.isActive}
                onChange={(event) => handleActiveToggleRequest(event.target.checked)}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2">
                  {user.isActive ? 'User is active' : 'User is inactive'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Toggle this status to control account access.
                </Typography>
              </Box>
            }
          />
        </Card>
      </Grid>
    </Grid>
  );

  const renderOrders = (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivered Station</TableCell>
              <TableCell>Train</TableCell>
              <TableCell>Pickup Person</TableCell>
              <TableCell>Delivery Person</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order: OrderRow) => (
              <TableRow hover key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>
                  <Chip label={order.status} size="small" color={order.status === 'DELIVERED' ? 'success' : 'default'} />
                </TableCell>
                <TableCell>{order.deliveredStationName}</TableCell>
                <TableCell>{order.trainName}</TableCell>
                <TableCell>{order.pickupPersonName} #{order.pickupPersonId}</TableCell>
                <TableCell>{order.deliveryPersonName} #{order.deliveryPersonId}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => router.push(paths.dashboard.orders.details(order.orderId))}>
                    <Iconify icon="solar:eye-bold" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {!orders.length && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography variant="subtitle1">No orders found for this user.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <Container maxWidth={false}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Button
          size="small"
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">User Details</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Review user information and related orders.
          </Typography>
        </Box>
      </Stack>

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 3 }}>
        <Tab value="overview" label="Overview" />
        <Tab value="orders" label={`Orders (${orders.length})`} />
      </Tabs>

      {currentTab === 'overview' && renderOverview}
      {currentTab === 'orders' && renderOrders}

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to ${pendingActiveValue ? 'activate' : 'deactivate'} ${user.firstname} ${user.lastname}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirm}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirmToggle}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
