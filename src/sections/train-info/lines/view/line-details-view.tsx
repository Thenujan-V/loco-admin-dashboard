import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useSnackbar } from 'notistack';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';
import { normalizeLinesResponse, useGetLinesQuery } from 'src/store/lines/line-api';
import {
  normalizeLineStationsResponse,
  useCreateLineStationMutation,
  useDeleteLineStationMutation,
  useGetLineStationsQuery,
} from 'src/store/line-stations/line-station-api';

import LineStationAddEditDialog from '../../line-stations/line-station-add-edit-dialog';

type Props = {
  id: string;
};

type LineStationFormPayload = {
  lineId: number | null;
  stations: Array<{
    stationId: number | null;
    lineOrder: number | null;
  }>;
};

export default function LineDetailsView({ id }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetLinesQuery();
  const { data: stationData } = useGetStationsQuery();
  const { data: lineStationData, isLoading: isStationsLoading, isError: isStationsError } =
    useGetLineStationsQuery(id);
  const [createLineStation] = useCreateLineStationMutation();
  const [deleteLineStation] = useDeleteLineStationMutation();

  const [currentTab, setCurrentTab] = useState('overview');
  const [openStationDialog, setOpenStationDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; stationName: string } | null>(null);

  const line = useMemo(() => {
    const apiLine = normalizeLinesResponse(data).find((item) => String(item.id) === id);
    return apiLine ?? {
      id,
      name: 'Unknown Line',
      startStationId: null,
      endStationId: null,
    };
  }, [data, id]);

  const stationMap = useMemo(() => {
    const stations = normalizeStationsResponse(stationData);
    return new Map(stations.map((station) => [Number(station.id), station.name]));
  }, [stationData]);

  const lineStations = useMemo(
    () => normalizeLineStationsResponse(lineStationData).sort((a, b) => (a.lineOrder ?? 0) - (b.lineOrder ?? 0)),
    [lineStationData]
  );

  const getStationName = useCallback(
    (stationId: number | null) => {
      if (stationId === null) return 'Unknown';
      return stationMap.get(Number(stationId)) || `Station #${stationId}`;
    },
    [stationMap]
  );

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.trainInfo.lines);
  }, [router]);

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, value: string) => {
    setCurrentTab(value);
  }, []);

  const handleSaveLineStations = useCallback(
    async (payload: LineStationFormPayload) => {
      if (!payload.lineId) return;

      try {
        const stations = payload.stations
          .filter((station) => station.stationId && station.lineOrder)
          .map((station) => ({
            stationId: Number(station.stationId),
            lineOrder: Number(station.lineOrder),
          }));

        if (!stations.length) {
          enqueueSnackbar('Please add at least one valid station row.', { variant: 'warning' });
          return;
        }

        await createLineStation({
          lineId: Number(payload.lineId),
          stations,
        }).unwrap();

        enqueueSnackbar(
          `${stations.length} line station${stations.length > 1 ? 's' : ''} added successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to add line stations.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createLineStation, enqueueSnackbar]
  );

  const handleDeleteStation = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      await deleteLineStation({ id: deleteTarget.id, lineId: id }).unwrap();
      enqueueSnackbar(`${deleteTarget.stationName} removed from this line successfully.`, {
        variant: 'success',
      });
      setDeleteTarget(null);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to remove line station.', {
        variant: 'error',
      });
    }
  }, [deleteLineStation, deleteTarget, enqueueSnackbar, id]);

  const renderOverview = (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h4">{line.name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Line ID #{line.id}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Label color="info">{`${lineStations.length} Stations`}</Label>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Start Station
                </Typography>
                <Typography variant="body1">{getStationName(line.startStationId)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  End Station
                </Typography>
                <Typography variant="body1">{getStationName(line.endStationId)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Stations Assigned
                </Typography>
                <Typography variant="body1">{lineStations.length}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Overview
                </Typography>
                <Typography variant="body1">
                  Manage the ordered station list for this train line from this page.
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6">Line Stations</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Add or remove stations from this line without leaving the line profile.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mt: 3 }}
            onClick={() => setOpenStationDialog(true)}
          >
            Add Stations
          </Button>
        </Card>
      </Grid>
    </Grid>
  );

  const renderStations = (
    <Card>
      <Box sx={{ p: 3, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Line Stations</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Ordered station list for this line.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenStationDialog(true)}
        >
          Add Stations
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Station ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {lineStations.map((station) => (
              <TableRow key={station.id} hover>
                <TableCell>{station.lineOrder}</TableCell>
                <TableCell>{getStationName(station.stationId)}</TableCell>
                <TableCell>{station.stationId}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() =>
                      setDeleteTarget({
                        id: station.id,
                        stationName: getStationName(station.stationId),
                      })
                    }
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {!lineStations.length && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography variant="subtitle1">
                    {isStationsLoading
                      ? 'Loading line stations...'
                      : isStationsError
                        ? 'Failed to load line stations.'
                        : 'No stations added to this line yet.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <>
      <Container maxWidth={false}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">Line Details</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Review line information and manage its stations.
            </Typography>
          </Box>
        </Stack>

        <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: 3 }}>
          <Tab value="overview" label="Overview" />
          <Tab value="stations" label={`Line Stations (${lineStations.length})`} />
        </Tabs>

        {currentTab === 'overview' && renderOverview}
        {currentTab === 'stations' && renderStations}
      </Container>

      <LineStationAddEditDialog
        open={openStationDialog}
        onClose={() => setOpenStationDialog(false)}
        onSave={handleSaveLineStations}
        fixedLineId={Number(line.id)}
      />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Station</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to remove ${deleteTarget?.stationName || 'this station'} from ${line.name}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteStation}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
