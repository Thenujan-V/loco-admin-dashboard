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

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { RHFUploadAvatar } from 'src/components/hook-form/rhf-upload';

export type FoodCategoryItem = {
  id?: string;
  name: string;
  description: string;
  image: string | File | any;
  availability: boolean;
};

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onSave: (payload: FoodCategoryItem[]) => Promise<void>;
};

// We wrap the list inside an array field for multiple insertions at once during creation
type FormValuesProps = {
  categories: FoodCategoryItem[];
};

function CategoryRow({ index, remove, canRemove }: { index: number; remove: any; canRemove: boolean }) {
  const { setValue } = useFormContext();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue(`categories.${index}.image`, newFile, { shouldValidate: true });
      }
    },
    [setValue, index]
  );

  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ p: 2, border: (theme) => `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
      <Box sx={{ flexShrink: 0 }}>
        <RHFUploadAvatar
          name={`categories.${index}.image`}
          maxSize={3145728}
          onDrop={handleDrop}
          sx={{ width: 80, height: 80, p: 0.5 }}
        />
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} sx={{ flex: 1 }}>
        <RHFTextField
          name={`categories.${index}.name`}
          label="Category Name"
        />
        <RHFTextField
          name={`categories.${index}.description`}
          label="Description"
        />
      </Box>
      {canRemove && (
        <IconButton color="error" onClick={() => remove(index)} sx={{ flexShrink: 0 }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      )}
    </Stack>
  );
}

export default function FoodCategoryAddEditDialog({ open, onClose, onSave }: Props) {
  const CategorySchema = Yup.object().shape({
    categories: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        image: Yup.mixed().required('Image is required'),
        availability: Yup.boolean().default(true),
      })
    ).min(1, 'At least one category is required'),
  });

  const getEmptyCategory = () => ({
    name: '',
    description: '',
    image: null,
    availability: true, // Defaultly true, implicit submission
  });

  const defaultValues = {
    categories: [getEmptyCategory()],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CategorySchema as any) as any,
    defaultValues: defaultValues as any,
  });

  const { reset, control, handleSubmit, formState: { isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues as any);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    await onSave(data.categories);
    onClose();
  });

  return (
    <Dialog fullWidth maxWidth="xl" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add New Categories</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {fields.map((item, index) => (
              <CategoryRow key={item.id} index={index} remove={remove} canRemove={fields.length > 1} />
            ))}

            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => append(getEmptyCategory())}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Another Category
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
