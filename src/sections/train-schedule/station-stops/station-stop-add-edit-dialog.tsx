import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { normalizeSchedulesResponse, useGetSchedulesQuery } from 'src/store/schedules/schedule-api';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';

export type StationStopRow = {
  id?: number | string;
  stationId: number | null;
  stopOrder: number | null;
  arrivalTime: string;
  arrivalDayOffset: number | null;
  departureTime: string;
  departureDayOffset: number | null;
};

export type StationStopPayload = {
  id?: string;
  scheduleId: number | null;
  stops: StationStopRow[];
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentStopConfig?: StationStopPayload | null;
  onSave: (payload: StationStopPayload) => Promise<void>;
  fixedScheduleId?: number | null;
};

type FormValuesProps = StationStopPayload;

function StopRow({
  index,
  remove,
  scheduleId,
  stationOptions,
}: {
  index: number;
  remove: any;
  scheduleId: any;
  stationOptions: Array<{ label: string; value: number }>;
}) {
  const { control } = useFormContext();

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap={1.5} sx={{ flex: 1 }}>
        <RHFAutocomplete
          name={`stops.${index}.stationId`}
          label="Station"
          options={!scheduleId ? [] : stationOptions}
          disabled={!scheduleId}
        />
        <RHFTextField
          name={`stops.${index}.stopOrder`}
          label="Stop Order"
          type="number"
          disabled={!scheduleId}
        />
        <RHFTextField
          name={`stops.${index}.arrivalTime`}
          label="Arrival Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={!scheduleId}
        />
        <RHFTextField
          name={`stops.${index}.arrivalDayOffset`}
          label="Arr. Offset"
          type="number"
          disabled={!scheduleId}
        />
        <RHFTextField
          name={`stops.${index}.departureTime`}
          label="Departure Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          inputProps={{
             step: 300,
          }}
          disabled={!scheduleId}
        />
        <RHFTextField
          name={`stops.${index}.departureDayOffset`}
          label="Dep. Offset"
          type="number"
          disabled={!scheduleId}
        />
      </Box>
      <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>
    </Stack>
  );
}

export default function StationStopAddEditDialog({ open, onClose, currentStopConfig, onSave, fixedScheduleId }: Props) {
  const isEdit = !!currentStopConfig;
  const { data: schedulesData, isLoading: isSchedulesLoading } = useGetSchedulesQuery();
  const { data: stationsData, isLoading: isStationsLoading } = useGetStationsQuery();
  const scheduleOptions = normalizeSchedulesResponse(schedulesData).map((schedule) => ({
    label: `Schedule #${schedule.id}`,
    value: Number(schedule.id),
  }));
  const stationOptions = normalizeStationsResponse(stationsData).map((station) => ({
    label: station.name,
    value: Number(station.id),
  }));

  const StopSchema = Yup.object().shape({
    scheduleId: Yup.number().typeError('Schedule is required').required('Schedule is required').nullable(),
    stops: Yup.array().of(
      Yup.object().shape({
        stationId: Yup.number().typeError('Station is required').required('Station is required').nullable(),
        stopOrder: Yup.number().typeError('Order is required').required('Order is required').nullable(),
        arrivalTime: Yup.string().required('Arrival Time is required'),
        arrivalDayOffset: Yup.number().typeError('Arrival Offset is required').required('Arrival Offset is required').nullable(),
        departureTime: Yup.string().required('Departure Time is required'),
        departureDayOffset: Yup.number().typeError('Departure Offset is required').required('Departure Offset is required').nullable(),
      })
    ).min(1, 'At least one stop must be added'),
  });

  const getEmptyStop = () => ({
    stationId: null,
    stopOrder: null,
    arrivalTime: '',
    arrivalDayOffset: null,
    departureTime: '',
    departureDayOffset: null,
  });

  const defaultValues = {
    scheduleId: fixedScheduleId || currentStopConfig?.scheduleId || null,
    stops: currentStopConfig?.stops?.length
      ? currentStopConfig.stops
      : [getEmptyStop()],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(StopSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const scheduleId = useWatch({ control, name: 'scheduleId' });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stops',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open, currentStopConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Station Stops' : 'Add Station Stops'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2}>
              <RHFAutocomplete
                name="scheduleId"
                label="Select Schedule"
                options={scheduleOptions}
                disabled={!!fixedScheduleId} // If opened from Overview Page, lock this
              />
            </Box>

            {!scheduleOptions.length && !fixedScheduleId && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isSchedulesLoading ? 'Loading schedules...' : 'No schedules available. Please create a schedule first.'}
              </Typography>
            )}

            {!stationOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isStationsLoading ? 'Loading stations...' : 'No stations available. Please create stations first.'}
              </Typography>
            )}

            <>
              {fields.map((item, index) => (
                <StopRow
                  key={item.id}
                  index={index}
                  remove={remove}
                  scheduleId={scheduleId}
                  stationOptions={stationOptions}
                />
              ))}

              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append(getEmptyStop())}
                sx={{ alignSelf: 'flex-start' }}
                disabled={!scheduleId}
              >
                Add Another Stop
              </Button>
            </>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
