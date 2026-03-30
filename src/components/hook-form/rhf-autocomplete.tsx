// ...existing code...
import React, { JSX } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete';

interface RHFAutocomplete
  extends Omit<AutocompleteProps<any, any, any, any>, 'renderInput' | 'value' | 'onChange'> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutocomplete({
  name,
  label,
  placeholder,
  helperText,
  ...other
}: RHFAutocomplete): JSX.Element {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control as any}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...other}
          value={
            other.options?.find(
              (option: any) => option.value === field.value
            ) ?? null
          }
          onChange={(_event, newValue) =>
            setValue(name, newValue?.value ?? null, {
              shouldValidate: true,
            })
          }
          onBlur={field.onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={field.ref}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? String(error.message) : helperText}
            />
          )}
        />
      )}
    />
  );
}