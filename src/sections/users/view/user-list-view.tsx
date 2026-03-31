import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { MOCK_USERS, UserRow } from '../user-mock-data';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function UserListView() {
  const router = useRouter();
  const [tableData, setTableData] = useState<UserRow[]>(MOCK_USERS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActiveChange = useCallback((id: number, checked: boolean) => {
    setTableData((prev) => prev.map((user) => (user.id === id ? { ...user, isActive: checked } : user)));
  }, []);

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Users</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Admin can review user details and manually control active status here.
        </Typography>
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
                      onChange={(event) => handleActiveChange(row.id, event.target.checked)}
                    />
                  </TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => router.push(paths.dashboard.users.details(String(row.id)))}>
                      <Iconify icon="solar:eye-bold" />
                    </IconButton>
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
    </Container>
  );
}
