import * as Yup from 'yup';
import { useEffect, useCallback } from 'react';
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
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

export type FoodDefaultItem = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  image: string | File | any;
  availability: boolean;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentItem?: FoodDefaultItem | null;
  onSave: (payload: FoodDefaultItem[]) => Promise<void>;
  options: { id: string; name: string }[];
};

type FormValuesProps = {
  items: FoodDefaultItem[];
};

function ItemRow({
  index,
  remove,
  options,
  canRemove,
}: {
  index: number;
  remove: any;
  options: any[];
  canRemove: boolean;
}) {
  const { setValue } = useFormContext();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(`items.${index}.image`, newFile, { shouldValidate: true });
      }
    },
    [setValue, index]
  );

  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ p: 2, border: (theme) => `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
      <Box sx={{ flexShrink: 0 }}>
        <RHFUploadAvatar
          name={`items.${index}.image`}
          maxSize={3145728}
          onDrop={handleDrop}
          sx={{ width: 80, height: 80, p: 0.5 }}
        />
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFTextField
          name={`items.${index}.name`}
          label="Item Name"
        />
        <RHFTextField
          name={`items.${index}.description`}
          label="Description"
        />
        <RHFSelect name={`items.${index}.categoryId`} label="Category">
           {options.map((opt) => (
             <MenuItem key={opt.id} value={opt.id}>
               {opt.name}
             </MenuItem>
           ))}
        </RHFSelect>
      </Box>
      {canRemove && (
        <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      )}
    </Stack>
  );
}

export default function DefaultItemAddEditDialog({ open, onClose, currentItem, onSave, options }: Props) {
  const isEdit = !!currentItem;

  const ItemSchema = Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        categoryId: Yup.string().required('Category is required'),
        image: Yup.mixed().required('Image is required'),
        availability: Yup.boolean().default(true),
      })
    ).min(1, 'At least one item is required'),
  });

  const getEmptyItem = () => ({
    name: '',
    description: '',
    categoryId: '',
    image: null,
    availability: true, // Defaultly true, implicit submission
  });

  const defaultValues = {
    items: currentItem ? [currentItem] : [getEmptyItem()],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ItemSchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open, currentItem]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data.items);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isEdit ? 'Edit Default Item' : 'Add New Default Items'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <ItemRow
                key={item.id}
                index={index}
                remove={remove}
                options={options}
                canRemove={!isEdit && fields.length > 1}
              />
            ))}

            {!isEdit && (
              <Button
                size="small"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => append(getEmptyItem())}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Another Item
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
