import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

interface TableSkeletonProps extends TableRowProps {
  colCount?: number; // number of text columns to display
  isAvatar?: boolean; // whether to show avatar skeleton
}

export default function TableSkeleton({ colCount = 5, isAvatar = true, ...other }: TableSkeletonProps) {
  return (
    <TableRow {...other}>
      <TableCell colSpan={12}>
        <Stack spacing={3} direction="row" alignItems="center">
        {isAvatar && (
            <Skeleton sx={{ borderRadius: 1.5, width: 48, height: 48, flexShrink: 0 }} />
          )}
          {Array.from({ length: colCount }).map((_, index) => (
            <Skeleton key={index} sx={{ width: "20%", height: 12 }} />
          ))}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
