import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface TablePaginationCustomProps extends TablePaginationProps {
  dense?: boolean;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  rowsPerPageOptions?: number[];
  sx?: SxProps<Theme>;
}

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}: TablePaginationCustomProps) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: 'transparent',
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
