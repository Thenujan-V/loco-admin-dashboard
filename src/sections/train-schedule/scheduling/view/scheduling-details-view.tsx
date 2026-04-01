import { useState, useCallback } from 'react';

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

  const schedule =
    normalizeSingleScheduleResponse(scheduleData) ?? {
      id,
      trainId: 1,
      routeId: 10,
      day: ['Monday', 'Tuesday'],
      dayOffset: 0,
    };
  const train = normalizeTrainsResponse(trainsData).find((t) => Number(t.id) === schedule.trainId);
  const route = normalizeRoutesResponse(routesData).find((r) => Number(r.id) === schedule.routeId);

  const normalizedStops = normalizeStationStopsResponse(stationStopsData);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; stationName: string } | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const stationMap = new Map(
    normalizeStationsResponse(stationsData).map((station) => [Number(station.id), station.name])
  );

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.trainSchedule.scheduling);
  }, [router]);

  const handleSaveStops = useCallback(async (newPayload: StationStopPayload) => {
    try {
      const hasExistingIds = newPayload.stops.some((stop) => stop.id);

      if (hasExistingIds) {
        await updateStationStops({
          scheduleId: Number(newPayload.scheduleId),
          stops: newPayload.stops
            .filter((stop) => stop.id)
            .map((stop) => ({
              id: stop.id as string | number,
              arrivalTime: stop.arrivalTime,
              arrivalDayOffset: Number(stop.arrivalDayOffset),
              departureTime: stop.departureTime,
              departureDayOffset: Number(stop.departureDayOffset),
            })),
        }).unwrap();
        enqueueSnackbar('Station stops updated successfully.', { variant: 'success' });
        return;
      }

      await createStationStops({
        scheduleId: Number(newPayload.scheduleId),
        stops: newPayload.stops.map((stop) => ({
          stationId: Number(stop.stationId),
          stopOrder: Number(stop.stopOrder),
          arrivalTime: stop.arrivalTime,
          arrivalDayOffset: Number(stop.arrivalDayOffset),
          departureTime: stop.departureTime,
          departureDayOffset: Number(stop.departureDayOffset),
        })),
      }).unwrap();
      enqueueSnackbar('Station stops added successfully.', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save station stops.', {
        variant: 'error',
      });
      throw error;
    }
  }, [createStationStops, enqueueSnackbar, updateStationStops]);

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

  const getStationName = (idNum: number | null) => {
    if (idNum === null) return 'Unknown';
    return stationMap.get(Number(idNum)) || `Station #${idNum}`;
  };

  const handleDeleteStop = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      await deleteStationStop({ id: deleteTarget.id, scheduleId: id }).unwrap();
      enqueueSnackbar(`${deleteTarget.stationName} removed successfully.`, { variant: 'success' });
      setDeleteTarget(null);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to remove station stop.', {
        variant: 'error',
      });
    }
  }, [deleteStationStop, deleteTarget, enqueueSnackbar, id]);

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

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => setOpenAddDialog(true)}
          >
            Manage Station Stops
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={3} mb={5}>
          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:train-bold-duotone" width={48} sx={{ color: 'primary.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Train</Typography>
             <Typography variant="h6">{train?.name || 'Unknown'} ({train?.type || 'N/A'})</Typography>
          </Card>

          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:map-point-wave-bold-duotone" width={48} sx={{ color: 'warning.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Route</Typography>
             <Typography variant="h6">{route?.name || 'Unknown'}</Typography>
             {route?.isReverse && <Label color="error" sx={{ mt: 1 }}>Reversed</Label>}
          </Card>

          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:calendar-date-bold-duotone" width={48} sx={{ color: 'info.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Operating Days</Typography>
             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mt: 1 }}>
               {schedule.day.map((d) => (
                 <Label key={d} color="info">{d}</Label>
               ))}
             </Box>
          </Card>
        </Box>

        <Card>
          <CardHeader title="Configured Stops" sx={{ mb: 3 }} />
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
                {currentStops.stops.map((row, index) => (
                  <TableRow key={index} hover>
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
                      <Typography variant="subtitle1">No stops configured for this schedule</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
