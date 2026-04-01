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
import Label from 'src/components/label';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import SchedulingAddEditDialog, { SchedulePayload } from '../scheduling-add-edit-dialog';
import { normalizeTrainsResponse, useGetTrainsQuery } from 'src/store/trains/train-api';
import { normalizeRoutesResponse, useGetRoutesQuery } from 'src/store/routes/route-api';
import {
  normalizeSchedulesResponse,
  useCreateScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useUpdateScheduleMutation,
} from 'src/store/schedules/schedule-api';

const FALLBACK_SCHEDULES: SchedulePayload[] = [
  { id: '1', trainId: 1, routeId: 10, day: ['Monday', 'Tuesday'], dayOffset: 0 },
  { id: '2', trainId: 2, routeId: 12, day: ['Saturday', 'Sunday'], dayOffset: 1 },
];

const toSchedulePayload = (schedule: SchedulePayload) => ({
  trainId: Number(schedule.trainId),
  routeId: Number(schedule.routeId),
  day: schedule.day,
  dayOffset: Number(schedule.dayOffset),
});

export default function SchedulingListView() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetSchedulesQuery();
  const { data: trainsData } = useGetTrainsQuery();
  const { data: routesData } = useGetRoutesQuery();
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<SchedulePayload | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SchedulePayload | null>(null);

  const tableData = useMemo(() => {
    const normalized = normalizeSchedulesResponse(data).map((schedule) => ({
      id: String(schedule.id),
      trainId: schedule.trainId,
      routeId: schedule.routeId,
      day: schedule.day,
      dayOffset: schedule.dayOffset,
    }));

    return normalized.length ? normalized : FALLBACK_SCHEDULES;
  }, [data]);

  const trainMap = useMemo(() => {
    const trains = normalizeTrainsResponse(trainsData);
    return new Map(trains.map((train) => [Number(train.id), { label: train.name, type: train.type }]));
  }, [trainsData]);

  const routeMap = useMemo(() => {
    const routes = normalizeRoutesResponse(routesData);
    return new Map(routes.map((route) => [Number(route.id), { label: route.name, isReverse: route.isReverse }]));
  }, [routesData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: SchedulePayload) => {
    setCurrentSchedule(row);
    setOpenAddDialog(true);
  }, []);

  const handleViewRow = useCallback((id: string) => {
    router.push(paths.dashboard.trainSchedule.schedulingDetails(id));
  }, [router]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteSchedule(deleteTarget.id).unwrap();
      enqueueSnackbar('Schedule deleted successfully.', { variant: 'success' });
      setDeleteTarget(null);

      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete schedule.', {
        variant: 'error',
      });
    }
  }, [deleteSchedule, deleteTarget, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveSchedules = useCallback(async (newSchedules: SchedulePayload[]) => {
    try {
      if (currentSchedule?.id) {
        await updateSchedule({
          id: currentSchedule.id,
          body: toSchedulePayload(newSchedules[0]),
        }).unwrap();
        enqueueSnackbar('Schedule updated successfully.', { variant: 'success' });
        return;
      }

      for (const schedule of newSchedules) {
        await createSchedule(toSchedulePayload(schedule)).unwrap();
      }

      enqueueSnackbar(
        `${newSchedules.length} schedule${newSchedules.length > 1 ? 's' : ''} created successfully.`,
        { variant: 'success' }
      );
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save schedule data.', {
        variant: 'error',
      });
      throw error;
    }
  }, [createSchedule, currentSchedule?.id, enqueueSnackbar, updateSchedule]);

  const handleNewSchedule = () => {
    setCurrentSchedule(null);
    setOpenAddDialog(true);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getTrain = (id: number | null) => {
    if (id === null) return { label: 'Unknown', type: 'Unknown' };
    return trainMap.get(Number(id)) || { label: `Train #${id}`, type: 'Unknown' };
  };

  const getRoute = (id: number | null) => {
    if (id === null) return { label: 'Unknown', isReverse: false };
    return routeMap.get(Number(id)) || { label: `Route #${id}`, isReverse: false };
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Scheduling</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading schedules...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load schedules from API. Showing fallback data.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewSchedule}
          >
            New Schedule
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Train Name</TableCell>
                  <TableCell>Train Type</TableCell>
                  <TableCell>Route Name</TableCell>
                  <TableCell>Route Reversed</TableCell>
                  <TableCell>Days Running</TableCell>
                  <TableCell>Day Offset</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => {
                  const train = getTrain(row.trainId);
                  const route = getRoute(row.routeId);

                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>{train.label}</TableCell>
                      <TableCell>{train.type}</TableCell>
                      <TableCell>{route.label}</TableCell>
                      <TableCell>
                        <Label color={route.isReverse ? 'warning' : 'success'}>
                          {route.isReverse ? 'Yes' : 'No'}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" flexWrap="wrap" gap={0.5}>
                          {row.day?.slice(0, 2).map((d) => (
                            <Label key={d} color="info">{d}</Label>
                          ))}
                          {row.day?.length > 2 && (
                            <Label color="info">+{row.day.length - 2} more</Label>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>{row.dayOffset}</TableCell>

                      <TableCell align="right">
                        <Tooltip title="View Overview">
                          <IconButton color="primary" onClick={() => handleViewRow(row.id as string)}>
                            <Iconify icon="solar:eye-bold" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton color="default" onClick={() => handleEditRow(row)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No schedules found</Typography>
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
        <SchedulingAddEditDialog
          open={openAddDialog}
          currentSchedule={currentSchedule}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveSchedules}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Schedule</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this schedule?
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
