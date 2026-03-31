import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
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

import Iconify from 'src/components/iconify';
import LineStationAddEditDialog, { LineStationPayload, MOCK_STATIONS, MOCK_LINES } from '../line-station-add-edit-dialog';

// A flat structure just for the list view
export type LineStationFlatItem = {
  id: string;
  lineId: number;
  stationId: number;
  lineOrder: number;
};

export default function LineStationListView() {
  const [tableData, setTableData] = useState<LineStationFlatItem[]>([
    { id: '1', lineId: 1, stationId: 101, lineOrder: 1 },
    { id: '2', lineId: 1, stationId: 102, lineOrder: 2 },
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentLineStation, setCurrentLineStation] = useState<LineStationPayload | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: LineStationFlatItem) => {
    // When editing from a flat row, typically we might load all stations for that line
    // or just pass that specific row into the dialog. The user's request showed an array so let's
    // support editing just this one or all for the line. For simplicity, we just pass the row content into the array.
    setCurrentLineStation({
      lineId: row.lineId,
      stations: [
        { stationId: row.stationId, lineOrder: row.lineOrder }
      ]
    });
    setOpenAddDialog(true);
  }, []);

  const handleDeleteRow = useCallback((id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
    
    // adjust page if deleting the last item on the page
    if (page > 0 && deleteRow.length <= page * rowsPerPage) {
      setPage(page - 1);
    }
  }, [page, rowsPerPage, tableData]);

  const handleSaveLineStations = useCallback((payload: LineStationPayload) => {
    const { lineId, stations } = payload;
    
    setTableData((prevData) => {
      // For simplicity in mock, just add or update based on whether currentLineStation existed
      if (currentLineStation) {
        // Find which one we're editing - let's assume we were editing the first station in the payload
        // This logic will be simpler when connected to BE. 
        return prevData.map((item) => {
           if (item.lineId === currentLineStation.lineId && item.stationId === currentLineStation.stations[0].stationId) {
              return { ...item, stationId: stations[0].stationId as number, lineId: lineId as number, lineOrder: stations[0].lineOrder as number };
           }
           return item;
        });
      }
      
      const newItems = stations.map((s, index) => ({
        id: (new Date().getTime() + index).toString(),
        lineId: lineId as number,
        stationId: s.stationId as number,
        lineOrder: s.lineOrder as number,
      }));
      return [...prevData, ...newItems];
    });
  }, [currentLineStation]);

  const handleNewLineStation = () => {
    setCurrentLineStation(null);
    setOpenAddDialog(true);
  };

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStationName = (id: number | null) => {
    return MOCK_STATIONS.find((s) => s.value === id)?.label || 'Unknown';
  };

  const getLineName = (id: number | null) => {
    return MOCK_LINES.find((l) => l.value === id)?.label || 'Unknown';
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Line Stations</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewLineStation}
          >
            Manage Line Stations
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Line Name</TableCell>
                  <TableCell>Station Name</TableCell>
                  <TableCell>Order Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{getLineName(row.lineId)}</TableCell>
                    <TableCell>{getStationName(row.stationId)}</TableCell>
                    <TableCell>{row.lineOrder}</TableCell>
                    
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="default" onClick={() => handleEditRow(row)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRow(row.id as string)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No line stations found</Typography>
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
        <LineStationAddEditDialog
          open={openAddDialog}
          currentLineStation={currentLineStation}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveLineStations}
        />
      )}
    </>
  );
}
