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
import Label from 'src/components/label';

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';
import {
  normalizeRoutesResponse,
  useCreateRouteMutation,
  useDeleteRouteMutation,
  useGetRoutesQuery,
  useUpdateRouteMutation,
} from 'src/store/routes/route-api';

import RouteAddEditDialog, { RouteItem } from '../route-add-edit-dialog';

const FALLBACK_ROUTES: RouteItem[] = [
  { id: '101', name: 'Downtown Express', lineId: 1, startStationId: 101, endStationId: 104, isReverse: false },
  { id: '102', name: 'Valley Loop', lineId: 2, startStationId: 102, endStationId: 105, isReverse: true },
];

const toRoutePayload = (route: RouteItem) => ({
  name: route.name.trim(),
  lineId: Number(route.lineId),
  startStationId: Number(route.startStationId),
  endStationId: Number(route.endStationId),
  isReverse: Boolean(route.isReverse),
});

export default function RouteListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetRoutesQuery();
  const { data: stationData } = useGetStationsQuery();
  const [createRoute] = useCreateRouteMutation();
  const [updateRoute] = useUpdateRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RouteItem | null>(null);

  const tableData = useMemo(() => {
    const normalized = normalizeRoutesResponse(data).map((route) => ({
      id: String(route.id),
      name: route.name,
      lineId: route.lineId,
      startStationId: route.startStationId,
      endStationId: route.endStationId,
      isReverse: route.isReverse,
    }));

    return normalized.length ? normalized : FALLBACK_ROUTES;
  }, [data]);

  const stationMap = useMemo(() => {
    const stations = normalizeStationsResponse(stationData);
    return new Map(stations.map((station) => [Number(station.id), station.name]));
  }, [stationData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
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

  const handleDeleteRequest = useCallback((row: RouteItem) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteRoute(deleteTarget.id).unwrap();
      enqueueSnackbar(`${deleteTarget.name} deleted successfully.`, { variant: 'success' });
      setDeleteTarget(null);

      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete route.', {
        variant: 'error',
      });
    }
  }, [deleteRoute, deleteTarget, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveRoutes = useCallback(
    async (newRoutes: RouteItem[]) => {
      try {
        if (currentRoute?.id) {
          await updateRoute({
            id: currentRoute.id,
            body: toRoutePayload(newRoutes[0]),
          }).unwrap();

          enqueueSnackbar(`${newRoutes[0].name} updated successfully.`, { variant: 'success' });
          return;
        }

        for (const route of newRoutes) {
          await createRoute(toRoutePayload(route)).unwrap();
        }

        enqueueSnackbar(
          `${newRoutes.length} route${newRoutes.length > 1 ? 's' : ''} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save route data.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createRoute, currentRoute?.id, enqueueSnackbar, updateRoute]
  );

  const handleNewRoute = () => {
    setCurrentRoute(null);
    setOpenAddDialog(true);
  };

  const getStationName = (id: number | null) => {
    if (id === null) return 'Unknown';
    return stationMap.get(Number(id)) || `Station #${id}`;
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Routes</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading routes...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load routes from API. Showing fallback data.
              </Typography>
            )}
          </Box>

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
                        <IconButton color="error" onClick={() => handleDeleteRequest(row)}>
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Route</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to delete ${deleteTarget?.name || 'this route'}?`}
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
