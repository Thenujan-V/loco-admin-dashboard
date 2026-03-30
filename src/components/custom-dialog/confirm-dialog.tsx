// ...existing code...
import React from 'react';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

interface ConfirmDialogProps extends Omit<DialogProps, 'content'> {
  title?: string;
  content?: React.ReactNode;
  action?: React.ReactNode;
}

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={(event) => onClose(event, 'backdropClick')}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
// ...existing code...