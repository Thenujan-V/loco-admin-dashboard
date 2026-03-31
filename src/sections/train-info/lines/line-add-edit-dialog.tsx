import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export type LineItem = {
  id?: string;
  name: string;
  startStationId: number | null;
  endStationId: number | null;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentLine?: LineItem | null;
  onSave: (lines: LineItem[]) => void;
};

type FormValuesProps = {
  lines: LineItem[];
};

export const MOCK_STATIONS = [
  { label: 'Central Station', value: 101 },
  { label: 'Northgate Station', value: 102 },
  { label: 'South Station', value: 103 },
  { label: 'West End Terminal', value: 104 },
  { label: 'East Side Station', value: 105 },
];

function LineRow({ index, remove, isEdit }: { index: number; remove: any; isEdit: boolean }) {
  useFormContext();

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFTextField name={`lines.${index}.name`} label="Line Name" />
        <RHFAutocomplete
          name={`lines.${index}.startStationId`}
          label="Start Station"
          options={MOCK_STATIONS}
        />
        <RHFAutocomplete
          name={`lines.${index}.endStationId`}
          label="End Station"
          options={MOCK_STATIONS}
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

export default function LineAddEditDialog({ open, onClose, currentLine, onSave }: Props) {
  const isEdit = !!currentLine;

  const LineSchema = Yup.object().shape({
    lines: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        startStationId: Yup.number().typeError('Start Station is required').required('Start Station is required').nullable(),
        endStationId: Yup.number().typeError('End Station is required').required('End Station is required').nullable(),
      })
    ),
  });

  const defaultValues = {
    lines: currentLine
      ? [currentLine]
      : [{ name: '', startStationId: null, endStationId: null }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LineSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open, currentLine]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    onSave(data.lines);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Line' : 'Add Line'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <LineRow key={item.id} index={index} remove={remove} isEdit={isEdit} />
            ))}

            {!isEdit && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append({ name: '', startStationId: null, endStationId: null })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Line
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
