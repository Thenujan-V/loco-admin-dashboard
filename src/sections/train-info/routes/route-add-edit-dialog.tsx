import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm, useFieldArray, Controller, useFormContext, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export type RouteItem = {
  id?: string;
  name: string;
  lineId: number | null;
  startStationId: number | null;
  endStationId: number | null;
  isReverse: boolean;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentRoute?: RouteItem | null;
  onSave: (routes: RouteItem[]) => void;
};

type FormValuesProps = {
  routes: RouteItem[];
};

export const MOCK_LINES = [
  { label: 'Red Line', value: 1 },
  { label: 'Blue Line', value: 2 },
  { label: 'Green Line', value: 3 },
];

export const MOCK_STATIONS = [
  { label: 'Central Station', value: 101, lineId: 1 },
  { label: 'Northgate Station', value: 102, lineId: 1 },
  { label: 'South Station', value: 103, lineId: 2 },
  { label: 'West End Terminal', value: 104, lineId: 2 },
  { label: 'East Side Station', value: 105, lineId: 3 },
];

function RouteRow({ index, remove, isEdit }: { index: number; remove: any; isEdit: boolean }) {
  const { control } = useFormContext();
  const lineId = useWatch({
    control,
    name: `routes.${index}.lineId`,
  });

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFTextField name={`routes.${index}.name`} label="Route Name" />
        <RHFAutocomplete
          name={`routes.${index}.lineId`}
          label="Line"
          options={MOCK_LINES}
        />
        <RHFAutocomplete
          name={`routes.${index}.startStationId`}
          label="Start Station"
          options={lineId ? MOCK_STATIONS.filter((s) => s.lineId === lineId) : []}
          disabled={!lineId}
        />
        <RHFAutocomplete
          name={`routes.${index}.endStationId`}
          label="End Station"
          options={lineId ? MOCK_STATIONS.filter((s) => s.lineId === lineId) : []}
          disabled={!lineId}
        />
      </Box>
      <Controller
        name={`routes.${index}.isReverse`}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Is Reverse"
            sx={{ flexShrink: 0 }}
          />
        )}
      />
      {!isEdit && (
        <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      )}
    </Stack>
  );
}

export default function RouteAddEditDialog({ open, onClose, currentRoute, onSave }: Props) {
  const isEdit = !!currentRoute;

  const RouteSchema = Yup.object().shape({
    routes: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        lineId: Yup.number().typeError('Line is required').required('Line is required').nullable(),
        startStationId: Yup.number().typeError('Start Station is required').required('Start Station is required').nullable(),
        endStationId: Yup.number().typeError('End Station is required').required('End Station is required').nullable(),
        isReverse: Yup.boolean().required(),
      })
    ),
  });

  const defaultValues = {
    routes: currentRoute
      ? [currentRoute]
      : [{ name: '', lineId: null, startStationId: null, endStationId: null, isReverse: false }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RouteSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'routes',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentRoute]);

  const onSubmit = handleSubmit(async (data) => {
    onSave(data.routes);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Route' : 'Add Route'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <RouteRow key={item.id} index={index} remove={remove} isEdit={isEdit} />
            ))}

            {!isEdit && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append({ name: '', lineId: null, startStationId: null, endStationId: null, isReverse: false })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Route
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
