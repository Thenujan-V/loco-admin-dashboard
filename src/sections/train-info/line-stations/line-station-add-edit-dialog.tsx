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
import { normalizeLinesResponse, useGetLinesQuery } from 'src/store/lines/line-api';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';

export type LineStationRow = {
  stationId: number | null;
  lineOrder: number | null;
};

export type LineStationPayload = {
  id?: string;
  lineId: number | null;
  stations: LineStationRow[];
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentLineStation?: LineStationPayload | null;
  onSave: (payload: LineStationPayload) => Promise<void>;
  fixedLineId?: number | null;
};

type FormValuesProps = LineStationPayload;

function StationRow({
  index,
  remove,
  lineId,
  stationOptions,
}: {
  index: number;
  remove: any;
  lineId: any;
  stationOptions: Array<{ label: string; value: number }>;
}) {
  const { control } = useFormContext();

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFAutocomplete
          name={`stations.${index}.stationId`}
          label="Station"
          options={!lineId ? [] : stationOptions}
          disabled={!lineId}
        />
        <RHFTextField
          name={`stations.${index}.lineOrder`}
          label="Line Order"
          type="number"
          disabled={!lineId}
        />
      </Box>
      <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
      </IconButton>
    </Stack>
  );
}

export default function LineStationAddEditDialog({
  open,
  onClose,
  currentLineStation,
  onSave,
  fixedLineId,
}: Props) {
  const isEdit = !!currentLineStation;
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

  const LineStationSchema = Yup.object().shape({
    lineId: Yup.number().typeError('Line is required').required('Line is required').nullable(),
    stations: Yup.array().of(
      Yup.object().shape({
        stationId: Yup.number().typeError('Station is required').required('Station is required').nullable(),
        lineOrder: Yup.number().typeError('Order is required').required('Order is required').nullable(),
      })
    ).min(1, 'At least one station must be added'),
  });

  const defaultValues = {
    lineId: currentLineStation?.lineId || fixedLineId || null,
    stations: currentLineStation?.stations?.length
      ? currentLineStation.stations
      : [{ stationId: null, lineOrder: null }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LineStationSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const lineId = useWatch({ control, name: 'lineId' });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stations',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open, currentLineStation, fixedLineId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Line Stations' : 'Add Line Stations'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2}>
              <RHFAutocomplete
                name="lineId"
                label="Select Line"
                options={lineOptions}
                disabled={!!fixedLineId}
              />
            </Box>

            {!lineOptions.length && !fixedLineId && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLinesLoading ? 'Loading lines...' : 'No lines available. Please create a line first.'}
              </Typography>
            )}

            {!stationOptions.length && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isStationsLoading ? 'Loading stations...' : 'No stations available. Please create stations first.'}
              </Typography>
            )}

              <>
                {fields.map((item, index) => (
                  <StationRow
                    key={item.id}
                    index={index}
                    remove={remove}
                    lineId={lineId}
                    stationOptions={stationOptions}
                  />
                ))}

                <Button
                  size="small"
                  color="primary"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => append({ stationId: null, lineOrder: null })}
                  sx={{ alignSelf: 'flex-start' }}
                  disabled={!lineId}
                >
                  Add Another Station
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
