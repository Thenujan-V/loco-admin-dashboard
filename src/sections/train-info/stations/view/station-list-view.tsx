import { useState, useCallback, useMemo } from 'react';

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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import {
  normalizeStationsResponse,
  useCreateStationMutation,
  useDeleteStationMutation,
  useGetStationsQuery,
  useUpdateStationMutation,
} from 'src/store/stations/station-api';

import StationAddEditDialog, { StationItem } from '../station-add-edit-dialog';

const FALLBACK_STATIONS: StationItem[] = [
  { id: '1', name: 'Central Station', longitude: '-0.1276', latitude: '51.5074' },
  { id: '2', name: 'West End Terminal', longitude: '-0.1332', latitude: '51.5126' },
];

const toStationPayload = (station: StationItem) => ({
  name: station.name.trim(),
  locationLongitude: Number(station.longitude),
  locationLatitude: Number(station.latitude),
});

export default function StationListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetStationsQuery();
  const [createStation] = useCreateStationMutation();
  const [updateStation] = useUpdateStationMutation();
  const [deleteStation] = useDeleteStationMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentStation, setCurrentStation] = useState<StationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StationItem | null>(null);

  const tableData = useMemo(() => {
    const normalized = normalizeStationsResponse(data).map((station) => ({
      id: String(station.id),
      name: station.name,
      longitude: String(station.locationLongitude),
      latitude: String(station.locationLatitude),
    }));

    return normalized.length ? normalized : FALLBACK_STATIONS;
  }, [data]);

  const handleChangePage = (_event: unknown, newPage: number) => {
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

  const handleDeleteRequest = useCallback((row: StationItem) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteStation(deleteTarget.id).unwrap();
      enqueueSnackbar(`${deleteTarget.name} deleted successfully.`, { variant: 'success' });
      setDeleteTarget(null);

      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete station.', {
        variant: 'error',
      });
    }
  }, [deleteStation, deleteTarget, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveStations = useCallback(
    async (newStations: StationItem[]) => {
      try {
        if (currentStation?.id) {
          await updateStation({
            id: currentStation.id,
            body: toStationPayload(newStations[0]),
          }).unwrap();

          enqueueSnackbar(`${newStations[0].name} updated successfully.`, { variant: 'success' });
          return;
        }

        for (const station of newStations) {
          await createStation(toStationPayload(station)).unwrap();
        }

        enqueueSnackbar(
          `${newStations.length} station${newStations.length > 1 ? 's' : ''} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save station data.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createStation, currentStation?.id, enqueueSnackbar, updateStation]
  );

  const handleNewStation = () => {
    setCurrentStation(null);
    setOpenAddDialog(true);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Stations</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading stations...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load stations from API. Showing fallback data.
              </Typography>
            )}
          </Box>

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
                        <IconButton color="error" onClick={() => handleDeleteRequest(row)}>
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to delete ${deleteTarget?.name || 'this station'}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
