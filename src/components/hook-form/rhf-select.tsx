// ...existing code...
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectProps } from '@mui/material/Select';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';

type Option = {
  value: string | number;
  label: string;
};

export interface RHFSelect extends Omit<TextFieldProps, 'name' | 'select'> {
  name: string;
  native?: boolean;
  maxHeight?: number | 'unset';
  helperText?: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
}

export function RHFSelect({
  name,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  ...other
}: RHFSelect) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      // control type is inferred from useFormContext
      control={(control as any)}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            sx: { textTransform: 'capitalize' },
          }}
          error={!!error}
          helperText={error ? (error.message as React.ReactNode) : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

export interface RHFMultiSelectProps extends Omit<SelectProps, 'name' | 'multiple' | 'renderValue'> {
  name: string;
  chip?: boolean;
  label?: string;
  options: Option[];
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  sx,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const renderValues = (selectedIds: any) => {
    const ids = Array.isArray(selectedIds) ? selectedIds : [];
    const selectedItems = options.filter((item) => ids.includes(item.value));

    if (!selectedItems.length && placeholder) {
      return (
        <Box component="em" sx={{ color: 'text.disabled' }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item) => (
            <Chip key={item.value} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Controller
      name={name}
      control={(control as any)}
      render={({ field, fieldState: { error } }) => (
<FormControl fullWidth size="small" sx={sx} error={!!error}>
  {label && (
    <InputLabel id={`${name}-label`}>
      {label}
    </InputLabel>
  )}

<Select
  {...field}
  multiple
  labelId={`${name}-label`}
  id={`${name}-select`}
  label={label}
  displayEmpty={!!placeholder}
  variant="outlined"
  renderValue={renderValues}
  {...other}
>



            {placeholder && (
              <MenuItem disabled value="">
                <em> {placeholder} </em>
              </MenuItem>
            )}

            {options.map((option) => {
              const selected = Array.isArray(field.value) && field.value.includes(option.value);

              return (
                <MenuItem key={option.value} value={option.value}>
                  {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? (error.message as React.ReactNode) : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
// ...existing code...