import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
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

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getOrdersByDeliveryPersonId } from 'src/sections/users/user-mock-data';

import { MOCK_DELIVERY_PERSONS, STATUS, DeliveryPersonRow } from './delivery-person-list-view';

type Props = {
  id: string;
};

export type DeliveryPersonDocuments = DeliveryPersonRow & {
  userPicture: string;
  userPictureStatus: string;
  userPictureReason: string;
  userDocument: string;
  userDocumentStatus: string;
  userDocumentReason: string;
};

const DELIVERY_DOCUMENTS: Record<number, Omit<DeliveryPersonDocuments, keyof DeliveryPersonRow>> = {
  701: {
    userPicture: 'https://api.dicebear.com/7.x/personas/svg?seed=AlexPhoto',
    userPictureStatus: STATUS.PENDING,
    userPictureReason: '',
    userDocument: 'https://placehold.co/600x400/png?text=Driver+License',
    userDocumentStatus: STATUS.PENDING,
    userDocumentReason: '',
  },
  702: {
    userPicture: 'https://api.dicebear.com/7.x/personas/svg?seed=SamPhoto',
    userPictureStatus: STATUS.APPROVED,
    userPictureReason: '',
    userDocument: 'https://placehold.co/600x400/png?text=National+ID',
    userDocumentStatus: STATUS.REJECTED,
    userDocumentReason: 'Document has expired',
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

export default function DeliveryPersonDetailsView({ id }: Props) {
  const router = useRouter();
  const selectedPerson = useMemo(
    () => MOCK_DELIVERY_PERSONS.find((person) => String(person.id) === id) ?? MOCK_DELIVERY_PERSONS[0],
    [id]
  );
  const [currentTab, setCurrentTab] = useState('overview');
  const [data, setData] = useState<DeliveryPersonDocuments>({
    ...selectedPerson,
    ...(DELIVERY_DOCUMENTS[selectedPerson.id] ?? DELIVERY_DOCUMENTS[701]),
  });
  const [viewImage, setViewImage] = useState<string | null>(null);

  const orders = useMemo(() => getOrdersByDeliveryPersonId(data.id), [data.id]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.deliveryPerson.list);
  }, [router]);

  const handleDocChange = (field: keyof DeliveryPersonDocuments, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOverallStatusChange = (newStatus: string) => {
    setData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleSaveVerifications = () => {
    console.info('Saving verification data:', data);
    alert('Documents verified and saved successfully!');
  };

  const renderOverviewTab = (
    <Card sx={{ mb: 3 }}>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }) }}>
          <Avatar src={data.image} sx={{ width: 80, height: 80, mb: 2 }} />
          <Typography variant="h6">{data.firstname} {data.lastname}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{data.email}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{data.phoneNumber}</Typography>
          <Box mt={2}>
            <Label color={data.isActive ? 'success' : 'error'}>{data.isActive ? 'Active' : 'Inactive'}</Label>
            <Label color={data.isVerified ? 'success' : 'warning'} sx={{ ml: 1 }}>{data.isVerified ? 'Verified' : 'Unverified'}</Label>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ px: { md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
            ID #{data.id}
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 1 }}>
            Handles final delivery of the order to the user at the assigned station.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ pl: { md: 3 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }) }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Overall Person Status</Typography>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={data.status}
              label="Status"
              onChange={(e) => handleOverallStatusChange(e.target.value)}
            >
              <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
              <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
              <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
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
          </TableBody>
        </Table>
        </TableContainer>
      </Card>
  );

  const renderDocumentCard = (
    title: string,
    imgUrl: string,
    statusField: keyof DeliveryPersonDocuments,
    reasonField: keyof DeliveryPersonDocuments
  ) => {
    const statusVal = data[statusField] as string;
    const reasonVal = data[reasonField] as string;

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
            border: (theme) => `1px solid ${theme.palette.divider}`
          }}
          onClick={() => setViewImage(imgUrl)}
        />

        <Stack spacing={2} sx={{ mt: 3, flexGrow: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusVal}
              label="Status"
              onChange={(e) => handleDocChange(statusField, e.target.value)}
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
              onChange={(e) => handleDocChange(reasonField, e.target.value)}
              placeholder="Explain why this document was rejected"
            />
          )}
        </Stack>
      </Card>
    );
  };

  const renderVerification = (
    <Box>
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12, md: 6 }}>
          {renderDocumentCard('User Picture', data.userPicture, 'userPictureStatus', 'userPictureReason')}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {renderDocumentCard('User ID Document', data.userDocument, 'userDocumentStatus', 'userDocumentReason')}
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
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Delivery Person Profile</Typography>
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

      <Dialog
        open={!!viewImage}
        onClose={() => setViewImage(null)}
        maxWidth="lg"
      >
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
    </>
  );
}
