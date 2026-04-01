import { useState, useCallback, useEffect, useMemo } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSnackbar } from 'notistack';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import {
  normalizeRestaurantsResponse,
  useGetRestaurantsQuery,
  useToggleRestaurantStatusMutation,
} from 'src/store/restaurants/restaurant-api';

import Iconify from 'src/components/iconify';

export const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export type RestaurantRow = {
  id: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  image: string;
  isActive: boolean;
  status: string;
};

export const MOCK_RESTAURANTS: RestaurantRow[] = [
  {
    id: 1,
    name: 'Spicy Loco Kitchen',
    address: '123 Main St, Tech Park',
    email: 'contact@locokitchen.com',
    phoneNumber: '+1 234 567 8900',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Spicy',
    isActive: true,
    status: STATUS.APPROVED,
  },
  {
    id: 2,
    name: 'Burger Station',
    address: 'Platform 4, City Center',
    email: 'hello@burgerstation.com',
    phoneNumber: '+1 987 654 3210',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=Burger',
    isActive: false,
    status: STATUS.PENDING,
  },
];

export default function RestaurantListView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetRestaurantsQuery();
  const [toggleRestaurantStatus] = useToggleRestaurantStatusMutation();

  const [tableData, setTableData] = useState<RestaurantRow[]>(MOCK_RESTAURANTS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    restaurant: RestaurantRow | null;
    nextValue: boolean;
  }>({
    open: false,
    restaurant: null,
    nextValue: false,
  });

  const normalizedRestaurants = useMemo(() => {
    return normalizeRestaurantsResponse(data).map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      email: restaurant.email,
      phoneNumber: restaurant.phoneNumber,
      isActive: restaurant.isActive,
      status: restaurant.status || STATUS.PENDING,
      image: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(`${restaurant.name || 'Restaurant'}-${restaurant.id}`)}`,
    })) as RestaurantRow[];
  }, [data]);

  useEffect(() => {
    if (normalizedRestaurants.length) {
      setTableData(normalizedRestaurants);
    }
  }, [normalizedRestaurants]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = useCallback((id: number, newStatus: string) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  }, []);

  const handleActiveToggleRequest = useCallback((restaurant: RestaurantRow, checked: boolean) => {
    setConfirmState({
      open: true,
      restaurant,
      nextValue: checked,
    });
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmState({
      open: false,
      restaurant: null,
      nextValue: false,
    });
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    if (!confirmState.restaurant) return;

    const { restaurant, nextValue } = confirmState;

    try {
      setTableData((prev) =>
        prev.map((item) => (item.id === restaurant.id ? { ...item, isActive: nextValue } : item))
      );
      await toggleRestaurantStatus({ userId: restaurant.id, isActive: nextValue }).unwrap();
      enqueueSnackbar(
        `${restaurant.name} has been ${nextValue ? 'activated' : 'deactivated'} successfully.`,
        { variant: 'success' }
      );
      handleCloseConfirm();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to update restaurant status.', {
        variant: 'error',
      });
    }
  }, [confirmState, enqueueSnackbar, handleCloseConfirm, toggleRestaurantStatus]);

  const handleViewRow = useCallback((id: number) => {
    router.push(paths.dashboard.restaurants.details(id.toString()));
  }, [router]);

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Box>
          <Typography variant="h4">Restaurants</Typography>
          {isLoading && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Loading restaurants...
            </Typography>
          )}
          {isError && (
            <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
              Failed to load restaurants from API. Showing fallback data.
            </Typography>
          )}
        </Box>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell>Restaurant</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={row.name} src={row.image} sx={{ mr: 2 }} />
                      <Typography variant="subtitle2" noWrap>
                        {row.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{row.email}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {row.phoneNumber}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {row.address}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={row.isActive}
                      onChange={(event) => handleActiveToggleRequest(row, event.target.checked)}
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={row.status}
                      onChange={(event: SelectChangeEvent) => handleStatusChange(row.id, event.target.value)}
                      sx={{ typography: 'body2', minWidth: 120 }}
                    >
                      <MenuItem value={STATUS.PENDING}>PENDING</MenuItem>
                      <MenuItem value={STATUS.APPROVED}>APPROVED</MenuItem>
                      <MenuItem value={STATUS.REJECTED}>REJECTED</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="View Overview Dashboard">
                      <IconButton color="primary" onClick={() => handleViewRow(row.id)}>
                        <Iconify icon="solar:eye-bold" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {tableData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1">No restaurants found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          page={page}
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={confirmState.open} onClose={handleCloseConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirmState.restaurant
              ? `Are you sure you want to ${confirmState.nextValue ? 'activate' : 'deactivate'} ${confirmState.restaurant.name}?`
              : 'Are you sure you want to update this restaurant status?'}
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
