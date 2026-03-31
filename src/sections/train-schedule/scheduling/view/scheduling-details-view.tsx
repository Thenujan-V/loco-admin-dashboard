import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Label from 'src/components/label';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { MOCK_TRAINS, MOCK_ROUTES } from '../scheduling-add-edit-dialog';
import StationStopAddEditDialog, { StationStopPayload, MOCK_STATIONS } from '../../station-stops/station-stop-add-edit-dialog';

type Props = {
  id: string;
};

// Mock function to simulate a fetch call
const getMockSchedule = (id: string) => {
  return { 
    id, 
    trainId: 1, 
    routeId: 10, 
    day: ['Monday', 'Tuesday'], 
    dayOffset: 0 
  };
};

// Mock function to simulate fetching stops for this schedule
const getMockStops = (scheduleId: number): StationStopPayload => {
  return {
    id: `stops-${scheduleId}`,
    scheduleId,
    stops: [
       { stationId: 101, stopOrder: 1, arrivalTime: '08:00', arrivalDayOffset: 0, departureTime: '08:05', departureDayOffset: 0 },
       { stationId: 102, stopOrder: 2, arrivalTime: '08:20', arrivalDayOffset: 0, departureTime: '08:25', departureDayOffset: 0 }
    ]
  };
};

export default function SchedulingDetailsView({ id }: Props) {
  const router = useRouter();

  // MOCK DATA FETCH (Swap this out for RTK Query later)
  const schedule = getMockSchedule(id);
  const train = MOCK_TRAINS.find((t) => t.value === schedule.trainId);
  const route = MOCK_ROUTES.find((r) => r.value === schedule.routeId);

  const [currentStops, setCurrentStops] = useState<StationStopPayload>(getMockStops(parseInt(id, 10)));
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleBack = useCallback(() => {
    router.push(paths.dashboard.trainSchedule.scheduling);
  }, [router]);

  const handleSaveStops = useCallback((newPayload: StationStopPayload) => {
    setCurrentStops(newPayload);
  }, []);

  const getStationName = (idNum: number | null) => {
    return MOCK_STATIONS.find((s) => s.value === idNum)?.label || 'Unknown';
  };

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
             <Typography variant="h6">{train?.label || 'Unknown'} ({train?.type || 'N/A'})</Typography>
          </Card>

          <Card sx={{ p: 3, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
             <Iconify icon="solar:map-point-wave-bold-duotone" width={48} sx={{ color: 'warning.main', mb: 2 }} />
             <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Route</Typography>
             <Typography variant="h6">{route?.label || 'Unknown'}</Typography>
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
                  </TableRow>
                ))}

                {(!currentStops.stops || currentStops.stops.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
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
    </>
  );
}
