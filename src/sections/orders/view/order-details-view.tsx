import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getOrderById, getUserById } from 'src/sections/users/user-mock-data';

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

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
}

export default function OrderDetailsView({ id }: Props) {
  const router = useRouter();
  const order = useMemo(() => getOrderById(id), [id]);
  const user = useMemo(() => getUserById(String(order.userId)), [order.userId]);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.orders.list);
  }, [router]);

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
        <Box>
          <Typography variant="h4">Order Details</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Full order breakdown for {order.orderId}.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
              <Box>
                <Typography variant="h5">{order.orderId}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Ordered by {user.firstname} {user.lastname} #{user.id}
                </Typography>
              </Box>
              <Chip label={order.status} color={order.status === 'DELIVERED' ? 'success' : 'default'} />
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoBlock label="Total Amount" value={formatCurrency(order.totalAmount)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoBlock label="Created At" value={formatDate(order.createdAt)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoBlock label="Delivered Train" value={order.trainName} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <InfoBlock label="Delivered Station" value={order.deliveredStationName} />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Restaurant Details
              </Typography>
              <Stack spacing={1.5}>
                <InfoBlock label="Name" value={order.restaurant.name} />
                <InfoBlock label="Address" value={order.restaurant.address} />
                <InfoBlock label="Location" value={order.restaurant.location} />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pickup Person Details
              </Typography>
              <Stack spacing={1.5}>
                <InfoBlock label="ID" value={String(order.pickupPerson.id)} />
                <InfoBlock label="Name" value={order.pickupPerson.name} />
                <InfoBlock label="Phone Number" value={order.pickupPerson.phoneNumber} />
                <InfoBlock label="Email" value={order.pickupPerson.email} />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Person Details
              </Typography>
              <Stack spacing={1.5}>
                <InfoBlock label="ID" value={String(order.deliveryPerson.id)} />
                <InfoBlock label="Name" value={order.deliveryPerson.name} />
                <InfoBlock label="Phone Number" value={order.deliveryPerson.phoneNumber} />
                <InfoBlock label="Email" value={order.deliveryPerson.email} />
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
