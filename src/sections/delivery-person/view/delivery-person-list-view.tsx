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
  normalizeDeliveryPersonsResponse,
  useGetDeliveryPersonsQuery,
  useToggleDeliveryPersonStatusMutation,
} from 'src/store/delivery-person/delivery-person-api';

import Iconify from 'src/components/iconify';

export const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export type DeliveryPersonRow = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status: string;
  image?: string;
};

export const MOCK_DELIVERY_PERSONS: DeliveryPersonRow[] = [
  {
    id: 701,
    firstname: 'Alex',
    lastname: 'Rider',
    email: 'alex.delivery@example.com',
    phoneNumber: '+1 202 555 0102',
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=Alex',
    isActive: true,
    status: STATUS.APPROVED,
  },
  {
    id: 702,
    firstname: 'Sam',
    lastname: 'Fisher',
    email: 'sam.delivery@example.com',
    phoneNumber: '+1 202 555 0104',
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=Sam',
    isActive: false,
    status: STATUS.PENDING,
  },
];

export default function DeliveryPersonListView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetDeliveryPersonsQuery();
  const [toggleDeliveryPersonStatus] = useToggleDeliveryPersonStatusMutation();

  const [tableData, setTableData] = useState<DeliveryPersonRow[]>(MOCK_DELIVERY_PERSONS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    person: DeliveryPersonRow | null;
    nextValue: boolean;
  }>({
    open: false,
    person: null,
    nextValue: false,
  });

  const normalizedDeliveryPersons = useMemo(() => {
    return normalizeDeliveryPersonsResponse(data).map((person) => ({
      id: person.id,
      firstname: person.firstname,
      lastname: person.lastname,
      email: person.email,
      phoneNumber: person.phoneNumber,
      isActive: person.isActive,
      status: person.status || STATUS.PENDING,
      image: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(`${person.firstname || 'Delivery'}-${person.id}`)}`,
    })) as DeliveryPersonRow[];
  }, [data]);

  useEffect(() => {
    if (normalizedDeliveryPersons.length) {
      setTableData(normalizedDeliveryPersons);
    }
  }, [normalizedDeliveryPersons]);

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

  const handleActiveToggleRequest = useCallback((person: DeliveryPersonRow, checked: boolean) => {
    setConfirmState({
      open: true,
      person,
      nextValue: checked,
    });
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmState({
      open: false,
      person: null,
      nextValue: false,
    });
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    if (!confirmState.person) return;

    const { person, nextValue } = confirmState;

    try {
      setTableData((prev) => prev.map((item) => (item.id === person.id ? { ...item, isActive: nextValue } : item)));
      await toggleDeliveryPersonStatus({ userId: person.id, isActive: nextValue }).unwrap();
      enqueueSnackbar(
        `${person.firstname} ${person.lastname} has been ${nextValue ? 'activated' : 'deactivated'} successfully.`,
        { variant: 'success' }
      );
      handleCloseConfirm();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to update delivery person status.', {
        variant: 'error',
      });
    }
  }, [confirmState, enqueueSnackbar, handleCloseConfirm, toggleDeliveryPersonStatus]);

  const handleViewRow = useCallback((id: number) => {
    router.push(paths.dashboard.deliveryPerson.details(id.toString()));
  }, [router]);

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Box>
          <Typography variant="h4">Delivery Persons</Typography>
          {isLoading && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Loading delivery persons...
            </Typography>
          )}
          {isError && (
            <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
              Failed to load delivery persons from API. Showing fallback data.
            </Typography>
          )}
        </Box>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell>Person</TableCell>
                <TableCell>Contact</TableCell>
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
                      <Avatar alt={row.firstname} src={row.image} sx={{ mr: 2 }} />
                      <Typography variant="subtitle2" noWrap>
                        {row.firstname} {row.lastname}
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
                    <Switch
                      checked={row.isActive}
                      onChange={(e) => handleActiveToggleRequest(row, e.target.checked)}
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      size="small"
                      value={row.status}
                      onChange={(e: SelectChangeEvent) => handleStatusChange(row.id, e.target.value)}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1">No delivery persons found</Typography>
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
            {confirmState.person
              ? `Are you sure you want to ${confirmState.nextValue ? 'activate' : 'deactivate'} ${confirmState.person.firstname} ${confirmState.person.lastname}?`
              : 'Are you sure you want to update this delivery person status?'}
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
