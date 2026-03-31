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
import Label from 'src/components/label';

import Iconify from 'src/components/iconify';
import RouteAddEditDialog, { RouteItem, MOCK_STATIONS } from '../route-add-edit-dialog';

export default function RouteListView() {
  const [tableData, setTableData] = useState<RouteItem[]>([
    { id: '101', name: 'Downtown Express', lineId: 1, startStationId: 101, endStationId: 104, isReverse: false },
    { id: '102', name: 'Valley Loop', lineId: 2, startStationId: 102, endStationId: 105, isReverse: true },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteItem | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: RouteItem) => {
    setCurrentRoute(row);
    setOpenAddDialog(true);
  }, []);

  const handleDeleteRow = useCallback((id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
    
    // adjust page if deleting the last item on the page
    if (page > 0 && deleteRow.length <= page * rowsPerPage) {
      setPage(page - 1);
    }
  }, [page, rowsPerPage, tableData]);

  const handleSaveRoutes = useCallback((newRoutes: RouteItem[]) => {
    setTableData((prevData) => {
      if (currentRoute) {
        return prevData.map((route) =>
          route.id === currentRoute.id ? { ...newRoutes[0], id: route.id } : route
        );
      }
      
      const generatedRoutes = newRoutes.map((r, index) => ({
        ...r,
        id: (new Date().getTime() + index).toString(),
      }));
      return [...prevData, ...generatedRoutes];
    });
  }, [currentRoute]);

  const handleNewRoute = () => {
    setCurrentRoute(null);
    setOpenAddDialog(true);
  };

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStationName = (id: number | null) => {
    return MOCK_STATIONS.find((s) => s.value === id)?.label || 'Unknown';
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Routes</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewRoute}
          >
            New Route
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Station</TableCell>
                  <TableCell>End Station</TableCell>
                  <TableCell>Is Reversed</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{getStationName(row.startStationId)}</TableCell>
                    <TableCell>{getStationName(row.endStationId)}</TableCell>
                    <TableCell>
                      <Label color={row.isReverse ? 'warning' : 'success'}>
                        {row.isReverse ? 'Yes' : 'No'}
                      </Label>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="default" onClick={() => handleEditRow(row)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRow(row.id as string)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No routes found</Typography>
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

      {openAddDialog && (
        <RouteAddEditDialog
          open={openAddDialog}
          currentRoute={currentRoute}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveRoutes}
        />
      )}
    </>
  );
}
