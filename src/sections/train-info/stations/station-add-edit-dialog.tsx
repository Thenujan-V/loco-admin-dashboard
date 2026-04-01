import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export type StationItem = {
  id?: string;
  name: string;
  longitude: string;
  latitude: string;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentStation?: StationItem | null;
  onSave: (stations: StationItem[]) => Promise<void>;
};

type FormValuesProps = {
  stations: StationItem[];
};

export default function StationAddEditDialog({ open, onClose, currentStation, onSave }: Props) {
  const isEdit = !!currentStation;

  const StationSchema = Yup.object().shape({
    stations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        longitude: Yup.string().required('Longitude is required'),
        latitude: Yup.string().required('Latitude is required'),
      })
    ),
  });

  const defaultValues = {
    stations: currentStation ? [currentStation] : [{ name: '', longitude: '', latitude: '' }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(StationSchema as any) as any,
    defaultValues,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stations',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentStation]);

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data.stations);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Station' : 'Add Station'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <Stack key={item.id} spacing={2} direction="row" alignItems="center">
                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ flex: 1 }}>
                  <RHFTextField name={`stations.${index}.name`} label="Station Name" />
                  <RHFTextField name={`stations.${index}.longitude`} label="Longitude" />
                  <RHFTextField name={`stations.${index}.latitude`} label="Latitude" />
                </Box>
                
                {!isEdit && fields.length > 1 && (
                  <IconButton color="error" onClick={() => remove(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                )}
              </Stack>
            ))}

            {!isEdit && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append({ name: '', longitude: '', latitude: '' })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Station
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
