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
import { normalizeTrainsResponse, useGetTrainsQuery } from 'src/store/trains/train-api';
import { normalizeRoutesResponse, useGetRoutesQuery } from 'src/store/routes/route-api';

export type SchedulePayload = {
  id?: string;
  trainId: number | null;
  routeId: number | null;
  day: string[];
  dayOffset: number | null;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentSchedule?: SchedulePayload | null;
  onSave: (payloads: SchedulePayload[]) => Promise<void>;
};

type FormValuesProps = {
  schedules: SchedulePayload[];
};

export const MOCK_TRAINS = [
  { label: 'Express Alpha', value: 1, type: 'Express' },
  { label: 'Loco Commuter', value: 2, type: 'Commuter' },
];

export const MOCK_ROUTES = [
  { label: 'Downtown Regular', value: 10, trainId: 1, isReverse: false },
  { label: 'Downtown Express', value: 11, trainId: 1, isReverse: true },
  { label: 'Valley Loop', value: 12, trainId: 2, isReverse: false },
];

export const MOCK_DAYS = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
];

function ScheduleRow({ index, remove, isEdit }: { index: number; remove: any; isEdit: boolean }) {
  useFormContext();
  const { data: trainsData } = useGetTrainsQuery();
  const { data: routesData } = useGetRoutesQuery();
  const trainOptions = normalizeTrainsResponse(trainsData).map((train) => ({
    label: train.name,
    value: Number(train.id),
    type: train.type,
  }));
  const routeOptions = normalizeRoutesResponse(routesData).map((route) => ({
    label: route.name,
    value: Number(route.id),
    isReverse: route.isReverse,
  }));

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFAutocomplete
          name={`schedules.${index}.trainId`}
          label="Train"
          options={trainOptions}
        />
        <RHFAutocomplete
          name={`schedules.${index}.routeId`}
          label="Route"
          options={routeOptions}
        />
        <RHFAutocomplete
          name={`schedules.${index}.day`}
          label="Days Running"
          multiple
          options={MOCK_DAYS}
        />
        <RHFTextField
          name={`schedules.${index}.dayOffset`}
          label="Day Offset"
          type="number"
        />
      </Box>
      {!isEdit && (
        <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      )}
    </Stack>
  );
}

export default function SchedulingAddEditDialog({ open, onClose, currentSchedule, onSave }: Props) {
  const isEdit = !!currentSchedule;
  const { data: trainsData, isLoading: isTrainsLoading } = useGetTrainsQuery();
  const { data: routesData, isLoading: isRoutesLoading } = useGetRoutesQuery();
  const trainOptions = normalizeTrainsResponse(trainsData);
  const routeOptions = normalizeRoutesResponse(routesData);

  const ScheduleSchema = Yup.object().shape({
    schedules: Yup.array().of(
      Yup.object().shape({
        trainId: Yup.number().typeError('Train is required').required('Train is required').nullable(),
        routeId: Yup.number().typeError('Route is required').required('Route is required').nullable(),
        day: Yup.array().of(Yup.string()).min(1, 'At least one day is required'),
        dayOffset: Yup.number().typeError('Day offset is required').required('Day offset is required').nullable(),
      })
    ).min(1),
  });

  const defaultValues = {
    schedules: currentSchedule
      ? [{ ...currentSchedule, day: currentSchedule.day || [] }]
      : [{ trainId: null, routeId: null, day: [], dayOffset: null }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ScheduleSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open, currentSchedule]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data.schedules);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {!trainOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isTrainsLoading ? 'Loading trains...' : 'No trains available. Please create a train first.'}
              </Typography>
            )}

            {!routeOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isRoutesLoading ? 'Loading routes...' : 'No routes available. Please create a route first.'}
              </Typography>
            )}

            {fields.map((item, index) => (
              <ScheduleRow key={item.id} index={index} remove={remove} isEdit={isEdit} />
            ))}

            {!isEdit && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append({ trainId: null, routeId: null, day: [], dayOffset: null })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Schedule
              </Button>
            )}
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
