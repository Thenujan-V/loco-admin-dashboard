import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import Label from 'src/components/label';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { normalizeTrainsResponse, useGetTrainsQuery } from 'src/store/trains/train-api';
import { normalizeRoutesResponse, useGetRoutesQuery } from 'src/store/routes/route-api';
import { normalizeSingleScheduleResponse, useGetScheduleByIdQuery } from 'src/store/schedules/schedule-api';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';
import {
  normalizeStationStopsResponse,
  useCreateStationStopsMutation,
  useDeleteStationStopMutation,
  useGetStationStopsQuery,
  useUpdateStationStopsMutation,
} from 'src/store/station-stops/station-stop-api';
import StationStopAddEditDialog, { StationStopPayload } from '../../station-stops/station-stop-add-edit-dialog';
import { useSnackbar } from 'notistack';

type Props = {
  id: string;
};

export default function SchedulingDetailsView({ id }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: scheduleData } = useGetScheduleByIdQuery(id);
  const { data: trainsData } = useGetTrainsQuery();
  const { data: routesData } = useGetRoutesQuery();
  const { data: stationsData } = useGetStationsQuery();
  const { data: stationStopsData } = useGetStationStopsQuery(id);
  const [createStationStops] = useCreateStationStopsMutation();
  const [updateStationStops] = useUpdateStationStopsMutation();
  const [deleteStationStop] = useDeleteStationStopMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const schedule =
    normalizeSingleScheduleResponse(scheduleData) ?? {
      id,
      trainId: 1,
      routeId: 10,
      day: ['Monday', 'Tuesday'],
      dayOffset: 0,
      train: null,
      route: null,
    };
  const train = normalizeTrainsResponse(trainsData).find((t) => Number(t.id) === schedule.trainId);
  const route = normalizeRoutesResponse(routesData).find((r) => Number(r.id) === schedule.routeId);
  const trainDetails =
    schedule.trainId === null
      ? { label: 'Unknown', type: 'Unknown' }
      : schedule.train
        ? { label: schedule.train.name || `Train #${schedule.trainId}`, type: schedule.train.type || 'Unknown' }
      : train
        ? { label: train.name, type: train.type || 'Unknown' }
        : { label: `Train #${schedule.trainId}`, type: 'Unknown' };
  const routeDetails =
    schedule.routeId === null
      ? { label: 'Unknown', isReverse: false }
      : schedule.route
        ? { label: schedule.route.name || `Route #${schedule.routeId}`, isReverse: schedule.route.isReverse }
      : route
        ? { label: route.name, isReverse: route.isReverse }
        : { label: `Route #${schedule.routeId}`, isReverse: false };

  const normalizedStops = useMemo(
    () =>
      normalizeStationStopsResponse(stationStopsData).sort(
        (a, b) => (a.stopOrder ?? 0) - (b.stopOrder ?? 0)
      ),
    [stationStopsData]
  );
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; stationName: string } | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const stationMap = useMemo(
    () => new Map(normalizeStationsResponse(stationsData).map((station) => [Number(station.id), station.name])),
    [stationsData]
  );

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.trainSchedule.root);
  }, [router]);

  const handleSaveStops = useCallback(async (newPayload: StationStopPayload) => {
    try {
      const stops = newPayload.stops.map((stop) => ({
        stationId: Number(stop.stationId),
        stopOrder: Number(stop.stopOrder),
        arrivalTime: stop.arrivalTime,
        arrivalDayOffset: Number(stop.arrivalDayOffset),
        departureTime: stop.departureTime,
        departureDayOffset: Number(stop.departureDayOffset),
      }));

      if (normalizedStops.length) {
        await updateStationStops({
          scheduleId: Number(newPayload.scheduleId),
          stops,
        }).unwrap();
        enqueueSnackbar('Station stops updated successfully.', { variant: 'success' });
        return;
      }

      await createStationStops({
        scheduleId: Number(newPayload.scheduleId),
        stops,
      }).unwrap();
      enqueueSnackbar('Station stops added successfully.', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save station stops.', {
        variant: 'error',
      });
      throw error;
    }
  }, [createStationStops, enqueueSnackbar, normalizedStops.length, updateStationStops]);

  const currentStops: StationStopPayload = {
    id: `stops-${id}`,
    scheduleId: Number(id),
    stops: normalizedStops.map((stop) => ({
      id: stop.id,
      stationId: stop.stationId,
      stopOrder: stop.stopOrder,
      arrivalTime: stop.arrivalTime,
      arrivalDayOffset: stop.arrivalDayOffset,
      departureTime: stop.departureTime,
      departureDayOffset: stop.departureDayOffset,
    })),
  };
  const paginatedStops = currentStops.stops.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStationName = (idNum: number | null) => {
    if (idNum === null) return 'Unknown';
    return stationMap.get(Number(idNum)) || `Station #${idNum}`;
  };

  const handleDeleteStop = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      await deleteStationStop({ id: deleteTarget.id, scheduleId: id }).unwrap();
      enqueueSnackbar(`${deleteTarget.stationName} removed successfully.`, { variant: 'success' });
      if (page > 0 && currentStops.stops.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
      setDeleteTarget(null);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to remove station stop.', {
        variant: 'error',
      });
    }
  }, [currentStops.stops.length, deleteStationStop, deleteTarget, enqueueSnackbar, id, page, rowsPerPage]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Button
            size="small"
            color="inherit"
            onClick={handleBack}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Schedule Overview</Typography>
        </Box>

        <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={3} mb={5}>
          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Box
               sx={{
                 width: 72,
                 height: 72,
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 bgcolor: 'primary.lighter',
                 color: 'primary.main',
                 mb: 2,
               }}
             >
               <Iconify icon="solar:train-bold-duotone" width={40} />
             </Box>
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Train</Typography>
             <Typography variant="h6">{trainDetails.label}</Typography>
             <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
               {trainDetails.type}
             </Typography>
          </Card>

          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:map-point-wave-bold-duotone" width={48} sx={{ color: 'warning.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Route</Typography>
             <Typography variant="h6">{routeDetails.label}</Typography>
             <Label color={routeDetails.isReverse ? 'warning' : 'success'} sx={{ mt: 1 }}>
               {routeDetails.isReverse ? 'Reversed' : 'Not Reversed'}
             </Label>
          </Card>

          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:calendar-date-bold-duotone" width={48} sx={{ color: 'info.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Days Running</Typography>
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mt: 1 }}>
               {schedule.day.map((d) => (
                 <Label key={d} color="info">{d}</Label>
               ))}
             </Box>
             <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
               Day Offset: {schedule.dayOffset ?? 0}
             </Typography>
          </Card>
        </Box>

        <Card sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              gap: 2,
              alignItems: { xs: 'flex-start', md: 'center' },
            }}
          >
            <Box>
              <Typography variant="h6">Schedule Stations</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Add, edit, and remove stops for this schedule directly from the overview page.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon={normalizedStops.length ? 'solar:pen-bold' : 'mingcute:add-line'} />}
              onClick={() => setOpenAddDialog(true)}
            >
              {normalizedStops.length ? 'Edit Schedule Stations' : 'Add Schedule Stations'}
            </Button>
          </Box>
        </Card>

        <Card>
          <CardHeader title="Configured Stations" sx={{ mb: 3 }} />
          <Divider />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Station</TableCell>
                  <TableCell>Arrival Time</TableCell>
                  <TableCell>Arr. Offset</TableCell>
                  <TableCell>Departure Time</TableCell>
                  <TableCell>Dep. Offset</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedStops.map((row) => (
                  <TableRow key={row.id ?? `${row.stationId}-${row.stopOrder}`} hover>
                    <TableCell>{row.stopOrder}</TableCell>
                    <TableCell sx={{ fontWeight: 'fontWeightMedium' }}>{getStationName(row.stationId)}</TableCell>
                    <TableCell>{row.arrivalTime}</TableCell>
                    <TableCell>{row.arrivalDayOffset}</TableCell>
                    <TableCell>{row.departureTime}</TableCell>
                    <TableCell>{row.departureDayOffset}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() =>
                          setDeleteTarget({
                            id: row.id as string | number,
                            stationName: getStationName(row.stationId),
                          })
                        }
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {(!currentStops.stops || currentStops.stops.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No stations configured for this schedule</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            page={page}
            count={currentStops.stops.length}
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
          currentStopConfig={currentStops}
          fixedScheduleId={parseInt(id, 10)}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveStops}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Station Stop</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to remove ${deleteTarget?.stationName || 'this stop'} from this schedule?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteStop}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
