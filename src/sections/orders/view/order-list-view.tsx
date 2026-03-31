import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { MOCK_ORDERS } from 'src/sections/users/user-mock-data';

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

export default function OrderListView() {
  const router = useRouter();

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Orders</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Review all user orders and open a full order breakdown by order ID.
        </Typography>
      </Box>

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
              {MOCK_ORDERS.map((row) => (
                <TableRow hover key={row.orderId}>
                  <TableCell>{row.orderId}</TableCell>
                  <TableCell>{formatCurrency(row.totalAmount)}</TableCell>
                  <TableCell>
                    <Chip label={row.status} size="small" color={row.status === 'DELIVERED' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>{row.deliveredStationName}</TableCell>
                  <TableCell>{row.trainName}</TableCell>
                  <TableCell>{row.pickupPersonName} #{row.pickupPersonId}</TableCell>
                  <TableCell>{row.deliveryPersonName} #{row.deliveryPersonId}</TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => router.push(paths.dashboard.orders.details(row.orderId))}>
                      <Iconify icon="solar:eye-bold" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
}
