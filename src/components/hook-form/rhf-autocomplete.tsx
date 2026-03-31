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
  const isMultiple = Boolean(other.multiple);

  return (
    <Controller
      name={name}
      control={control as any}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...other}
          value={
            isMultiple
              ? (other.options ?? []).filter((option: any) =>
                  Array.isArray(field.value) ? field.value.includes(option.value) : false
                )
              : other.options?.find((option: any) => option.value === field.value) ?? null
          }
          isOptionEqualToValue={(option: any, value: any) => option.value === value?.value}
          onChange={(_event, newValue) =>
            setValue(
              name,
              isMultiple
                ? Array.isArray(newValue)
                  ? newValue.map((option: any) => option.value)
                  : []
                : newValue?.value ?? null,
              {
                shouldValidate: true,
              }
            )
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
