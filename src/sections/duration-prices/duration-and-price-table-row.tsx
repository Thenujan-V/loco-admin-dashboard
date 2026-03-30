// ...existing code...
import React from "react";
// @mui
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Button from "@mui/material/Button";
import { PackagePlan } from "./packagePlan";
import { Stack } from "@mui/material";
import { ConfirmDialog } from "src/components/custom-dialog";

interface Props {
  row: PackagePlan;
  onEdit?: (id: any) => void;
  onRemove?: (id: any) => void;
}

export default function DurationAndPriceTableRow({ row, onEdit, onRemove }: Props) {
  const { durationLabel, priceINR, priceLKR, status } = row;
  const confirm = useBoolean();
  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{durationLabel}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{priceINR}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{priceLKR}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === "active" && "success") ||
              (status === "inactive" && "error") ||
              "default"
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              color="inherit"
              variant="contained"
              size="small"
              onClick={() => {
                onEdit?.(row.id);
              }}
              // startIcon={<Iconify icon="mingcute:edit-line" />}
            >
              Edit
            </Button>
            <Button
              color="error"
              variant="contained"
              size="small"
              onClick={() => {
                onRemove?.(row.id);
              }}
              // startIcon={<Iconify small icon="mingcute:delete-line" />}
            >
              Remove
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
// ...existing code...
