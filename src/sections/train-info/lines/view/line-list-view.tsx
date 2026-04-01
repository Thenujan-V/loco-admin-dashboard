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
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { normalizeStationsResponse, useGetStationsQuery } from 'src/store/stations/station-api';
import {
  normalizeLinesResponse,
  useCreateLineMutation,
  useDeleteLineMutation,
  useGetLinesQuery,
  useUpdateLineMutation,
} from 'src/store/lines/line-api';

import LineAddEditDialog, { LineItem } from '../line-add-edit-dialog';

const FALLBACK_LINES: LineItem[] = [
  { id: '1', name: 'Red Line', startStationId: 101, endStationId: 102 },
  { id: '2', name: 'Blue Line', startStationId: 103, endStationId: 104 },
];

const toLinePayload = (line: LineItem) => ({
  name: line.name.trim(),
  startStationId: Number(line.startStationId),
  endStationId: Number(line.endStationId),
});

export default function LineListView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetLinesQuery();
  const { data: stationData } = useGetStationsQuery();
  const [createLine] = useCreateLineMutation();
  const [updateLine] = useUpdateLineMutation();
  const [deleteLine] = useDeleteLineMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentLine, setCurrentLine] = useState<LineItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LineItem | null>(null);

  const tableData = useMemo(() => {
    const normalized = normalizeLinesResponse(data).map((line) => ({
      id: String(line.id),
      name: line.name,
      startStationId: line.startStationId,
      endStationId: line.endStationId,
    }));

    return normalized.length ? normalized : FALLBACK_LINES;
  }, [data]);

  const stationMap = useMemo(() => {
    const stations = normalizeStationsResponse(stationData);
    return new Map(stations.map((station) => [Number(station.id), station.name]));
  }, [stationData]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: LineItem) => {
    setCurrentLine(row);
    setOpenAddDialog(true);
  }, []);

  const handleViewRow = useCallback((lineId: string) => {
    router.push(paths.dashboard.trainInfo.lineDetails(lineId));
  }, [router]);

  const handleDeleteRequest = useCallback((row: LineItem) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteLine(deleteTarget.id).unwrap();
      enqueueSnackbar(`${deleteTarget.name} deleted successfully.`, { variant: 'success' });
      setDeleteTarget(null);

      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete line.', {
        variant: 'error',
      });
    }
  }, [deleteLine, deleteTarget, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveLines = useCallback(
    async (newLines: LineItem[]) => {
      try {
        if (currentLine?.id) {
          await updateLine({
            id: currentLine.id,
            body: toLinePayload(newLines[0]),
          }).unwrap();

          enqueueSnackbar(`${newLines[0].name} updated successfully.`, { variant: 'success' });
          return;
        }

        for (const line of newLines) {
          await createLine(toLinePayload(line)).unwrap();
        }

        enqueueSnackbar(
          `${newLines.length} line${newLines.length > 1 ? 's' : ''} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save line data.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createLine, currentLine?.id, enqueueSnackbar, updateLine]
  );

  const handleNewLine = () => {
    setCurrentLine(null);
    setOpenAddDialog(true);
  };

  const getStationName = (id: number | null) => {
    if (id === null) return 'Unknown';
    return stationMap.get(Number(id)) || `Station #${id}`;
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Lines</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading lines...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load lines from API. Showing fallback data.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewLine}
          >
            New Line
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Station</TableCell>
                  <TableCell>End Station</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{getStationName(row.startStationId)}</TableCell>
                    <TableCell>{getStationName(row.endStationId)}</TableCell>

                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton color="primary" onClick={() => handleViewRow(String(row.id))}>
                          <Iconify icon="solar:eye-bold" />
                        </IconButton>
                      </Tooltip>

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
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No lines found</Typography>
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
        <LineAddEditDialog
          open={openAddDialog}
          currentLine={currentLine}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveLines}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Line</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to delete ${deleteTarget?.name || 'this line'}?`}
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
