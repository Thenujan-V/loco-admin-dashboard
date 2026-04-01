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
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { normalizeLinesResponse, useGetLinesQuery } from 'src/store/lines/line-api';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';
import { normalizeLineStationsResponse, useGetLineStationsQuery } from 'src/store/line-stations/line-station-api';

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
  onSave: (routes: RouteItem[]) => Promise<void>;
};

type FormValuesProps = {
  routes: RouteItem[];
};

function RouteRow({
  index,
  remove,
  isEdit,
  lineOptions,
  stationMap,
}: {
  index: number;
  remove: any;
  isEdit: boolean;
  lineOptions: Array<{ label: string; value: number }>;
  stationMap: Map<number, string>;
}) {
  const { control } = useFormContext();
  const lineId = useWatch({
    control,
    name: `routes.${index}.lineId`,
  });
  const { data: lineStationsData, isLoading: isLineStationsLoading } = useGetLineStationsQuery(lineId as number, {
    skip: !lineId,
  });

  const stationOptions = normalizeLineStationsResponse(lineStationsData)
    .sort((a, b) => (a.lineOrder ?? 0) - (b.lineOrder ?? 0))
    .map((station) => ({
      label: stationMap.get(Number(station.stationId)) || `Station #${station.stationId}`,
      value: Number(station.stationId),
    }));

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFTextField name={`routes.${index}.name`} label="Route Name" />
        <RHFAutocomplete
          name={`routes.${index}.lineId`}
          label="Line"
          options={lineOptions}
        />
        <RHFAutocomplete
          name={`routes.${index}.startStationId`}
          label="Start Station"
          options={lineId ? stationOptions : []}
          disabled={!lineId || isLineStationsLoading}
        />
        <RHFAutocomplete
          name={`routes.${index}.endStationId`}
          label="End Station"
          options={lineId ? stationOptions : []}
          disabled={!lineId || isLineStationsLoading}
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
  const { data: linesData, isLoading: isLinesLoading } = useGetLinesQuery();
  const { data: stationsData, isLoading: isStationsLoading } = useGetStationsQuery();
  const lineOptions = normalizeLinesResponse(linesData).map((line) => ({
    label: line.name,
    value: Number(line.id),
  }));
  const stationOptions = normalizeStationsResponse(stationsData).map((station) => ({
    label: station.name,
    value: Number(station.id),
  }));
  const stationMap = new Map(stationOptions.map((station) => [station.value, station.label]));

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
    await onSave(data.routes);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Route' : 'Add Route'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {!lineOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLinesLoading ? 'Loading lines...' : 'No lines available. Please create a line first.'}
              </Typography>
            )}

            {!stationOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isStationsLoading ? 'Loading stations...' : 'No stations available. Please create stations first.'}
              </Typography>
            )}

            {fields.map((item, index) => (
              <RouteRow
                key={item.id}
                index={index}
                remove={remove}
                isEdit={isEdit}
                lineOptions={lineOptions}
                stationMap={stationMap}
              />
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
