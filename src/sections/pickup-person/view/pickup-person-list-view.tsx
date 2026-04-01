import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Label from 'src/components/label';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';

export const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export type PickupPersonRow = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  isActive: boolean;
  status: string;
  image?: string; // Derived or mock image
};

export const MOCK_PICKUP_PERSONS: PickupPersonRow[] = [
  {
    id: 501,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.pickup@example.com',
    phoneNumber: '+1 202 555 0101',
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=John',
    isVerified: true,
    isActive: true,
    status: STATUS.APPROVED,
  },
  {
    id: 502,
    firstname: 'Jane',
    lastname: 'Peris',
    email: 'jane.pickup@example.com',
    phoneNumber: '+1 202 555 0103',
    image: 'https://api.dicebear.com/7.x/personas/svg?seed=Jane',
    isVerified: false,
    isActive: false,
    status: STATUS.PENDING,
  },
];

export default function PickupPersonListView() {
  const router = useRouter();

  const [tableData, setTableData] = useState<PickupPersonRow[]>(MOCK_PICKUP_PERSONS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
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

  const handleActiveChange = useCallback((id: number, newActive: boolean) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, isActive: newActive } : row))
    );
  }, []);

  const handleViewRow = useCallback((id: number) => {
    router.push(paths.dashboard.pickupPerson.details(id.toString()));
  }, [router]);

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
        <Typography variant="h4">Pickup Persons</Typography>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell>Person</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Verified</TableCell>
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
                    <Label color={row.isVerified ? 'success' : 'warning'}>
                      {row.isVerified ? 'Yes' : 'No'}
                    </Label>
                  </TableCell>

                  <TableCell>
                    <Switch
                      checked={row.isActive}
                      onChange={(e) => handleActiveChange(row.id, e.target.checked)}
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
                    <Typography variant="subtitle1">No pickup persons found</Typography>
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
    </Container>
  );
}
