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

import Iconify from 'src/components/iconify';
import StationAddEditDialog, { StationItem } from '../station-add-edit-dialog';

export default function StationListView() {
  const [tableData, setTableData] = useState<StationItem[]>([
    { id: '1', name: 'Central Station', longitude: '-0.1276', latitude: '51.5074' },
    { id: '2', name: 'West End Terminal', longitude: '-0.1332', latitude: '51.5126' },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentStation, setCurrentStation] = useState<StationItem | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: StationItem) => {
    setCurrentStation(row);
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

  const handleSaveStations = useCallback((newStations: StationItem[]) => {
    setTableData((prevData) => {
      // If editing existing
      if (currentStation) {
        return prevData.map((station) =>
          station.id === currentStation.id ? newStations[0] : station
        );
      }
      
      // If adding new
      const generatedStations = newStations.map((s, index) => ({
        ...s,
        id: new Date().getTime().toString() + index, // mock id generator
      }));
      return [...prevData, ...generatedStations];
    });
  }, [currentStation]);

  const handleNewStation = () => {
    setCurrentStation(null);
    setOpenAddDialog(true);
  };

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Stations</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewStation}
          >
            New Station
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Longitude</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.longitude}</TableCell>
                    <TableCell>{row.latitude}</TableCell>
                    
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
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No stations found</Typography>
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
        <StationAddEditDialog
          open={openAddDialog}
          currentStation={currentStation}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveStations}
        />
      )}
    </>
  );
}
