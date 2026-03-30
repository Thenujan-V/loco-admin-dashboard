import { Card, Stack, Box, Skeleton } from "@mui/material";

type Props = {
  hasIcon?: boolean;
  rowCount?: number;
};

export default function CardDetailsSkeleton({
  hasIcon = true,
  rowCount = 3,
}: Props) {
  return (
    <Card>
      <Stack spacing={2.5} sx={{ p: 3 }}>
        
        {/* Title */}
        <Skeleton variant="text" width={180} height={50} />

        {/* Avatar */}
        {hasIcon && (
          <Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        )}

        {/* Rows */}
        {Array.from({ length: rowCount }).map((_, index) => (
          <Stack key={index} direction="row" alignItems="center" spacing={2}>
            
            {/* Label */}
            <Skeleton variant="text" width={140} height={25} />

            {/* Value */}
            <Skeleton variant="text" width="40%" height={25} />

          </Stack>
        ))}

        {/* Status row (optional styling) */}
        {/* <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="text" width={140} height={20} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Stack> */}

      </Stack>
    </Card>
  );
}