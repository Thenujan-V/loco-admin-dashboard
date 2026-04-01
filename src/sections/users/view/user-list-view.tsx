import { useCallback, useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { normalizeUsersResponse, useGetUsersQuery, useToggleUserStatusMutation } from 'src/store/users/user-api';
import { useSnackbar } from 'notistack';

import { MOCK_USERS, UserRow } from '../user-mock-data';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function UserListView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [tableData, setTableData] = useState<UserRow[]>(MOCK_USERS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    user: UserRow | null;
    nextValue: boolean;
  }>({
    open: false,
    user: null,
    nextValue: false,
  });

  const normalizedUsers = useMemo(() => {
    return normalizeUsersResponse(data).map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isVerified: Boolean(user.isVerified),
      isActive: user.isActive,
      createdAt: user.createdAt || new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(`${user.firstname || 'User'}-${user.id}`)}`,
    })) as UserRow[];
  }, [data]);

  useEffect(() => {
    if (normalizedUsers.length) {
      setTableData(normalizedUsers);
    }
  }, [normalizedUsers]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActiveToggleRequest = useCallback((user: UserRow, checked: boolean) => {
    setConfirmState({
      open: true,
      user,
      nextValue: checked,
    });
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmState({
      open: false,
      user: null,
      nextValue: false,
    });
  }, []);

  const handleConfirmToggle = useCallback(async () => {
    if (!confirmState.user) return;

    const { user, nextValue } = confirmState;

    try {
      setTableData((prev) => prev.map((item) => (item.id === user.id ? { ...item, isActive: nextValue } : item)));
      await toggleUserStatus({ userId: user.id, isActive: nextValue }).unwrap();
      enqueueSnackbar(
        `${user.firstname} ${user.lastname} has been ${nextValue ? 'activated' : 'deactivated'} successfully.`,
        { variant: 'success' }
      );
      handleCloseConfirm();
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to update user status.', {
        variant: 'error',
      });
    }
  }, [confirmState, enqueueSnackbar, handleCloseConfirm, toggleUserStatus]);

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Users</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Admin can review user details and manually control active status here.
        </Typography>
        {isLoading && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Loading users...
          </Typography>
        )}
        {isError && (
          <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
            Failed to load users from API. Showing fallback data.
          </Typography>
        )}
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={row.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {row.firstname} {row.lastname}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {row.firstname} / {row.lastname}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>
                    <Label color={row.isVerified ? 'success' : 'warning'}>
                      {row.isVerified ? 'Yes' : 'No'}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={row.isActive}
                      onChange={(event) => handleActiveToggleRequest(row, event.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View user details">
                      <IconButton
                        color="primary"
                        onClick={() => router.push(paths.dashboard.users.details(String(row.id)))}
                        sx={{
                          width: 40,
                          height: 40,
                          color: 'primary.main',
                        }}
                      >
                        <Iconify icon="solar:eye-bold" width={20} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {!tableData.length && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="subtitle1">No users found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={tableData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <Dialog open={confirmState.open} onClose={handleCloseConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {confirmState.user
              ? `Are you sure you want to ${confirmState.nextValue ? 'activate' : 'deactivate'} ${confirmState.user.firstname} ${confirmState.user.lastname}?`
              : 'Are you sure you want to update this user status?'}
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
