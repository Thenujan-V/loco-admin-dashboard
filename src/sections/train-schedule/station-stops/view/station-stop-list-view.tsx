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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { normalizeSchedulesResponse, useGetSchedulesQuery } from 'src/store/schedules/schedule-api';

import Iconify from 'src/components/iconify';
import StationStopAddEditDialog, { StationStopPayload } from '../station-stop-add-edit-dialog';

export default function StationStopListView() {
  const router = useRouter();
  const { data: schedulesData } = useGetSchedulesQuery();

  const [tableData, setTableData] = useState<StationStopPayload[]>([
    { 
      id: '1', 
      scheduleId: 1, 
      stops: [
        { stationId: 101, stopOrder: 1, arrivalTime: '08:00', arrivalDayOffset: 0, departureTime: '08:05', departureDayOffset: 0 },
        { stationId: 102, stopOrder: 2, arrivalTime: '08:20', arrivalDayOffset: 0, departureTime: '08:25', departureDayOffset: 0 }
      ] 
    },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<StationStopPayload | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: StationStopPayload) => {
    setCurrentConfig(row);
    setOpenAddDialog(true);
  }, []);

  const handleViewSchedule = useCallback((id: number) => {
    router.push(paths.dashboard.trainSchedule.schedulingDetails(id.toString()));
  }, [router]);

  const handleDeleteRow = useCallback((id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
    
    if (page > 0 && deleteRow.length <= page * rowsPerPage) {
      setPage(page - 1);
    }
  }, [page, rowsPerPage, tableData]);

  const handleSaveStops = useCallback(async (newPayload: StationStopPayload) => {
    setTableData((prevData) => {
      // If editing existing
      if (currentConfig) {
        return prevData.map((config) =>
          config.id === currentConfig.id ? { ...newPayload, id: config.id } : config
        );
      }
      
      // Creating new
      return [...prevData, { ...newPayload, id: new Date().getTime().toString() }];
    });
    return Promise.resolve();
  }, [currentConfig]);

  const handleNewConfig = () => {
    setCurrentConfig(null);
    setOpenAddDialog(true);
  };

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const scheduleOptions = normalizeSchedulesResponse(schedulesData).map((schedule) => ({
    label: `Schedule #${schedule.id}`,
    value: Number(schedule.id),
  }));

  const getScheduleName = (id: number | null) => {
    return scheduleOptions.find((s) => s.value === id)?.label || 'Unknown Schedule';
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Station Stops</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewConfig}
          >
            Manage Station Stops
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Schedule Name</TableCell>
                  <TableCell>Total Stops</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{getScheduleName(row.scheduleId)}</TableCell>
                    <TableCell>
                      <Label color="info">{row.stops.length} Stops Configured</Label>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Tooltip title="View Overview Page">
                        <IconButton color="primary" onClick={() => handleViewSchedule(row.scheduleId as number)}>
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </Tooltip>

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
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No station stops found</Typography>
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
        <StationStopAddEditDialog
          open={openAddDialog}
          currentStopConfig={currentConfig}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveStops}
        />
      )}
    </>
  );
}
