import { useState, useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import {
  normalizeTrainsResponse,
  useCreateTrainMutation,
  useDeleteTrainMutation,
  useGetTrainsQuery,
  useUpdateTrainMutation,
} from 'src/store/trains/train-api';

import TrainAddEditDialog, { TrainItem } from '../train-add-edit-dialog';

const FALLBACK_TRAINS: TrainItem[] = [
  { id: '12001', name: 'Shatabdi Express', type: 'Superfast' },
  { id: '12951', name: 'Rajdhani Express', type: 'Rajdhani' },
];

const toTrainPayload = (train: TrainItem) => ({
  name: train.name.trim(),
  type: train.type.trim(),
});

export default function TrainListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetTrainsQuery();
  const [createTrain] = useCreateTrainMutation();
  const [updateTrain] = useUpdateTrainMutation();
  const [deleteTrain] = useDeleteTrainMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentTrain, setCurrentTrain] = useState<TrainItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainItem | null>(null);

  const tableData = useMemo(() => {
    const normalized = normalizeTrainsResponse(data).map((train) => ({
      id: String(train.id),
      name: train.name,
      type: train.type,
    }));

    return normalized.length ? normalized : FALLBACK_TRAINS;
  }, [data]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: TrainItem) => {
    setCurrentTrain(row);
    setOpenAddDialog(true);
  }, []);

  const handleDeleteRequest = useCallback((row: TrainItem) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteTrain(deleteTarget.id).unwrap();
      enqueueSnackbar(`${deleteTarget.name} deleted successfully.`, { variant: 'success' });
      setDeleteTarget(null);

      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete train.', {
        variant: 'error',
      });
    }
  }, [deleteTarget, deleteTrain, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveTrains = useCallback(
    async (newTrains: TrainItem[]) => {
      try {
        if (currentTrain?.id) {
          await updateTrain({
            id: currentTrain.id,
            body: toTrainPayload(newTrains[0]),
          }).unwrap();

          enqueueSnackbar(`${newTrains[0].name} updated successfully.`, { variant: 'success' });
          return;
        }

        for (const train of newTrains) {
          await createTrain(toTrainPayload(train)).unwrap();
        }

        enqueueSnackbar(
          `${newTrains.length} train${newTrains.length > 1 ? 's' : ''} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save train data.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createTrain, currentTrain?.id, enqueueSnackbar, updateTrain]
  );

  const handleNewTrain = () => {
    setCurrentTrain(null);
    setOpenAddDialog(true);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Trains</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading trains...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load trains from API. Showing fallback data.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewTrain}
          >
            New Train
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="default" onClick={() => handleEditRow(row)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRequest(row)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No trains found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            page={page}
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {openAddDialog && (
        <TrainAddEditDialog
          open={openAddDialog}
          currentTrain={currentTrain}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveTrains}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Train</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to delete ${deleteTarget?.name || 'this train'}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
