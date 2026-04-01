import { useMemo, useState, useEffect, useCallback } from 'react';

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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useSnackbar } from 'notistack';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getOrdersByRestaurantName } from 'src/sections/users/user-mock-data';
import {
  normalizeRestaurantsResponse,
  useGetRestaurantsQuery,
  useToggleRestaurantStatusMutation,
} from 'src/store/restaurants/restaurant-api';

import { MOCK_RESTAURANTS, STATUS, RestaurantRow } from './restaurant-list-view';

type Props = {
  id: string;
};

export type RestaurantDocuments = RestaurantRow & {
  userPicture: string;
  userPictureStatus: string;
  userPictureReason: string;
  userDocument: string;
  userDocumentStatus: string;
  userDocumentReason: string;
  restaurantDocument: string;
  restaurantDocumentStatus: string;
  restaurantDocumentReason: string;
};

const RESTAURANT_DOCUMENTS: Record<number, Omit<RestaurantDocuments, keyof RestaurantRow>> = {
  1: {
    userPicture: 'https://api.dicebear.com/7.x/personas/svg?seed=SpicyUser',
    userPictureStatus: STATUS.PENDING,
    userPictureReason: '',
    userDocument: 'https://placehold.co/600x400/png?text=Passport+ID',
    userDocumentStatus: STATUS.PENDING,
    userDocumentReason: '',
    restaurantDocument: 'https://placehold.co/600x400/png?text=Business+License',
    restaurantDocumentStatus: STATUS.PENDING,
    restaurantDocumentReason: '',
  },
  2: {
    userPicture: 'https://api.dicebear.com/7.x/personas/svg?seed=BurgerOwner',
    userPictureStatus: STATUS.APPROVED,
    userPictureReason: '',
    userDocument: 'https://placehold.co/600x400/png?text=National+ID',
    userDocumentStatus: STATUS.APPROVED,
    userDocumentReason: '',
    restaurantDocument: 'https://placehold.co/600x400/png?text=Food+License',
    restaurantDocumentStatus: STATUS.REJECTED,
    restaurantDocumentReason: 'License copy is not readable',
  },
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

const getDefaultDocumentRecord = (restaurant: RestaurantRow): RestaurantDocuments => ({
  ...restaurant,
  ...(RESTAURANT_DOCUMENTS[restaurant.id] ?? RESTAURANT_DOCUMENTS[1]),
});

export default function RestaurantDetailsView({ id }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetRestaurantsQuery();
  const [toggleRestaurantStatus] = useToggleRestaurantStatusMutation();
  const [currentTab, setCurrentTab] = useState('overview');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActiveValue, setPendingActiveValue] = useState(false);

  const restaurant = useMemo(() => {
    const apiRestaurant = normalizeRestaurantsResponse(data).find((item) => String(item.id) === id);

    if (apiRestaurant) {
      return {
        id: apiRestaurant.id,
        name: apiRestaurant.name,
        address: apiRestaurant.address,
        email: apiRestaurant.email,
        phoneNumber: apiRestaurant.phoneNumber,
        image: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(`${apiRestaurant.name || 'Restaurant'}-${apiRestaurant.id}`)}`,
        isActive: apiRestaurant.isActive,
        status: apiRestaurant.status || STATUS.PENDING,
      } satisfies RestaurantRow;
    }

    return MOCK_RESTAURANTS.find((item) => String(item.id) === id) ?? MOCK_RESTAURANTS[0];
  }, [data, id]);

  const [documentData, setDocumentData] = useState<RestaurantDocuments>(() =>
    getDefaultDocumentRecord(restaurant)
  );

  useEffect(() => {
    setDocumentData((prev) => {
      const nextBase = getDefaultDocumentRecord(restaurant);

      if (prev.id !== restaurant.id) {
        return nextBase;
      }

      return {
        ...nextBase,
        userPictureStatus: prev.userPictureStatus,
        userPictureReason: prev.userPictureReason,
        userDocumentStatus: prev.userDocumentStatus,
        userDocumentReason: prev.userDocumentReason,
        restaurantDocumentStatus: prev.restaurantDocumentStatus,
        restaurantDocumentReason: prev.restaurantDocumentReason,
      };
    });
  }, [restaurant]);

  const orders = useMemo(() => getOrdersByRestaurantName(restaurant.name), [restaurant.name]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.restaurants.list);
  }, [router]);

  const handleDocChange = (field: keyof RestaurantDocuments, value: string) => {
    setDocumentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOverallStatusChange = (newStatus: string) => {
    setDocumentData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleSaveVerifications = () => {
    console.info('Saving verification data:', documentData);
    enqueueSnackbar('Restaurant verification details saved locally.', { variant: 'success' });
  };

  const handleActiveToggleRequest = useCallback((checked: boolean) => {
    setPendingActiveValue(checked);
    setConfirmOpen(true);
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    try {
      await toggleRestaurantStatus({ userId: restaurant.id, isActive: pendingActiveValue }).unwrap();
      enqueueSnackbar(
        `${restaurant.name} has been ${pendingActiveValue ? 'activated' : 'deactivated'} successfully.`,
        { variant: 'success' }
      );
      setConfirmOpen(false);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to update restaurant status.', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar, pendingActiveValue, restaurant.id, restaurant.name, toggleRestaurantStatus]);

  const renderOverviewTab = (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Avatar src={restaurant.image} sx={{ width: 88, height: 88 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5">{restaurant.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Restaurant ID #{restaurant.id}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Label color={restaurant.isActive ? 'success' : 'error'}>
                  {restaurant.isActive ? 'Active' : 'Inactive'}
                </Label>
                <Label color="info">{documentData.status}</Label>
              </Stack>
            </Box>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Restaurant Name
              </Typography>
              <Typography variant="body1">{restaurant.name}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Email
              </Typography>
              <Typography variant="body1">{restaurant.email}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Phone Number
              </Typography>
              <Typography variant="body1">{restaurant.phoneNumber}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Address
              </Typography>
              <Typography variant="body1">{restaurant.address}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Orders
              </Typography>
              <Typography variant="body1">{orders.length}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Summary
              </Typography>
              <Typography variant="body1">
                This profile shows restaurant verification details and all orders linked to this vendor.
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Active Status</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Admin can manually enable or disable this restaurant here.
            </Typography>

            <FormControlLabel
              sx={{ mt: 3, alignItems: 'flex-start' }}
              control={
                <Switch
                  checked={restaurant.isActive}
                  onChange={(event) => handleActiveToggleRequest(event.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">
                    {restaurant.isActive ? 'Restaurant is active' : 'Restaurant is inactive'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Toggle this status to control restaurant availability in admin.
                  </Typography>
                </Box>
              }
            />
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Verification Status</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 2 }}>
              Manage the internal verification label used on this profile.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={documentData.status}
                label="Status"
                onChange={(event) => handleOverallStatusChange(event.target.value)}
              >
                <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
                <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
                <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );

  const renderOrdersTab = (
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
            {orders.map((order) => (
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
                  <Typography variant="subtitle1">No orders found for this restaurant.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const renderDocumentCard = (
    title: string,
    imgUrl: string,
    statusField: keyof RestaurantDocuments,
    reasonField: keyof RestaurantDocuments
  ) => {
    const statusVal = documentData[statusField] as string;
    const reasonVal = documentData[reasonField] as string;

    return (
      <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>

        <Box
          component="img"
          src={imgUrl}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            borderRadius: 1,
            cursor: 'zoom-in',
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
          onClick={() => setViewImage(imgUrl)}
        />

        <Stack spacing={2} sx={{ mt: 3, flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusVal}
              label="Status"
              onChange={(event) => handleDocChange(statusField, event.target.value)}
            >
              <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
              <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
              <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
            </Select>
          </FormControl>

          {statusVal === STATUS.REJECTED && (
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Rejection Reason"
              value={reasonVal}
              onChange={(event) => handleDocChange(reasonField, event.target.value)}
              placeholder="Explain why this document was rejected"
            />
          )}
        </Stack>
      </Card>
    );
  };

  const renderVerification = (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard('User Picture', documentData.userPicture, 'userPictureStatus', 'userPictureReason')}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard('User ID Document', documentData.userDocument, 'userDocumentStatus', 'userDocumentReason')}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {renderDocumentCard(
            'Restaurant License',
            documentData.restaurantDocument,
            'restaurantDocumentStatus',
            'restaurantDocumentReason'
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Iconify icon="solar:diskette-bold" />}
          onClick={handleSaveVerifications}
        >
          Save Verifications
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Button
            size="small"
            color="inherit"
            onClick={handleBack}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Restaurant Profile</Typography>
        </Box>

        <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 3 }}>
          <Tab value="overview" label="Overview" />
          <Tab value="orders" label={`Orders (${orders.length})`} />
          <Tab value="verification" label="Document Verification" />
        </Tabs>

        {currentTab === 'overview' && renderOverviewTab}
        {currentTab === 'orders' && renderOrdersTab}
        {currentTab === 'verification' && renderVerification}
      </Container>

      <Dialog open={!!viewImage} onClose={() => setViewImage(null)} maxWidth="lg">
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setViewImage(null)}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'common.white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
          >
            <Iconify icon="solar:close-circle-bold" />
          </IconButton>
          <Box
            component="img"
            src={viewImage || ''}
            sx={{ display: 'block', maxWidth: '100%', maxHeight: '90vh' }}
          />
        </Box>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to ${pendingActiveValue ? 'activate' : 'deactivate'} ${restaurant.name}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseConfirm}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmToggle}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
