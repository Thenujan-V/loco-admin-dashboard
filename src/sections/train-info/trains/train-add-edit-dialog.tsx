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

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export type TrainItem = {
  id?: string;
  name: string;
  type: string;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentTrain?: TrainItem | null;
  onSave: (trains: TrainItem[]) => Promise<void>;
};

type FormValuesProps = {
  trains: TrainItem[];
};

export default function TrainAddEditDialog({ open, onClose, currentTrain, onSave }: Props) {
  const isEdit = !!currentTrain;

  const TrainSchema = Yup.object().shape({
    trains: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Train Name is required'),
        type: Yup.string().required('Train Type is required'),
      })
    ),
  });

  const defaultValues = {
    trains: currentTrain ? [currentTrain] : [{ name: '', type: '' }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(TrainSchema as any) as any,
    defaultValues,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trains',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentTrain]);

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data.trains);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Train' : 'Add Train'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <Stack key={item.id} spacing={2} direction="row" alignItems="center">
                <RHFTextField name={`trains.${index}.name`} label="Train Name" />
                <RHFTextField name={`trains.${index}.type`} label="Train Type" />
                
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
                onClick={() => append({ name: '', type: '' })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Train
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
