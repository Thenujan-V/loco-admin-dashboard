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
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Label from 'src/components/label';

import Iconify from 'src/components/iconify';

import DefaultItemAddEditDialog, { FoodDefaultItem } from '../default-item-add-edit-dialog';

const MOCK_CATEGORIES = [
  { id: '1', name: 'Breakfast Combo' },
  { id: '2', name: 'Dinner Standard' },
  { id: '3', name: 'Beverages' },
];

const MOCK_ITEMS: FoodDefaultItem[] = [
  {
    id: '1',
    name: 'Pancakes',
    description: 'Fluffy buttermilk pancakes with syrup',
    categoryId: '1',
    image: 'https://placehold.co/100x100/png?text=Pancakes',
    availability: true,
  },
  {
    id: '2',
    name: 'Steak & Fries',
    description: 'Grilled steak served with crispy french fries',
    categoryId: '2',
    image: 'https://placehold.co/100x100/png?text=Steak',
    availability: false,
  },
];

export default function FoodDefaultItemListView() {
  const [tableData, setTableData] = useState<FoodDefaultItem[]>(MOCK_ITEMS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodDefaultItem | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: FoodDefaultItem) => {
    setCurrentItem(row);
    setOpenAddDialog(true);
  }, []);

  const handleAvailabilityToggle = useCallback((id: string, newAvailability: boolean) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, availability: newAvailability } : row))
    );
  }, []);

  const handleSaveItems = useCallback((newItems: FoodDefaultItem[]) => {
    setTableData((prevData) => {
      if (currentItem) {
        const updatedItem = newItems[0];
        return prevData.map((row) => (row.id === currentItem.id ? { ...updatedItem, id: row.id } : row));
      }
      const mappedNewItems = newItems.map((item) => ({ ...item, id: new Date().getTime().toString() + Math.random().toString() }));
      return [...prevData, ...mappedNewItems];
    });
  }, [currentItem]);

  const handleNewConfig = () => {
    setCurrentItem(null);
    setOpenAddDialog(true);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getCategoryName = (id: string) => {
    return MOCK_CATEGORIES.find((cat) => cat.id === id)?.name || 'Unknown Category';
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Default Items</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewConfig}
          >
            Add New Item
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name} src={row.image as string} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />
                        <Typography variant="subtitle2" noWrap>
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 350 }} noWrap>
                        {row.description}
                      </Typography>
                    </TableCell>

                    <TableCell>
                       <Label color="info" variant="soft">
                         {getCategoryName(row.categoryId)}
                       </Label>
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={row.availability}
                        onChange={(e) => handleAvailabilityToggle(row.id as string, e.target.checked)}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton color="default" onClick={() => handleEditRow(row)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No default items found</Typography>
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
        <DefaultItemAddEditDialog
          open={openAddDialog}
          currentItem={currentItem}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveItems}
          options={MOCK_CATEGORIES}
        />
      )}
    </>
  );
}
