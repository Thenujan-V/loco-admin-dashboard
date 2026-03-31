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

import Iconify from 'src/components/iconify';

import FoodCategoryAddEditDialog, { FoodCategoryItem } from '../food-category-add-edit-dialog';

const MOCK_CATEGORIES: FoodCategoryItem[] = [
  {
    id: '1',
    name: 'Breakfast Combo',
    description: 'Hot and fresh morning meals',
    image: 'https://placehold.co/100x100/png?text=Breakfast',
    availability: true,
  },
  {
    id: '2',
    name: 'Dinner Standard',
    description: 'Hearty evening combos to replenish energy',
    image: 'https://placehold.co/100x100/png?text=Dinner',
    availability: false,
  },
];

export default function FoodCategoryListView() {
  const [tableData, setTableData] = useState<FoodCategoryItem[]>(MOCK_CATEGORIES);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<FoodCategoryItem | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRow = useCallback((row: FoodCategoryItem) => {
    setCurrentCategory(row);
    setOpenAddDialog(true);
  }, []);

  const handleDeleteRow = useCallback((id: string) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
    if (page > 0 && deleteRow.length <= page * rowsPerPage) {
      setPage(page - 1);
    }
  }, [page, rowsPerPage, tableData]);

  const handleAvailabilityToggle = useCallback((id: string, newAvailability: boolean) => {
    setTableData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, availability: newAvailability } : row))
    );
  }, []);

  const handleSaveCategories = useCallback((newItems: FoodCategoryItem[]) => {
    setTableData((prevData) => {
      if (currentCategory) {
        // Edit mode (array array of 1)
        const updatedItem = newItems[0];
        return prevData.map((row) => (row.id === currentCategory.id ? { ...updatedItem, id: row.id } : row));
      }
      // Create mode (array of many)
      const mappedNewItems = newItems.map((item) => ({ ...item, id: new Date().getTime().toString() + Math.random().toString() }));
      return [...prevData, ...mappedNewItems];
    });
  }, [currentCategory]);

  const handleNewConfig = () => {
    setCurrentCategory(null);
    setOpenAddDialog(true);
  };

  // Pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Typography variant="h4">Food Categories</Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewConfig}
          >
            Add New Category
          </Button>
        </Box>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar alt={row.name} src={row.image} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />
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
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1">No categories found</Typography>
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
        <FoodCategoryAddEditDialog
          open={openAddDialog}
          currentCategory={currentCategory}
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveCategories}
        />
      )}
    </>
  );
}
