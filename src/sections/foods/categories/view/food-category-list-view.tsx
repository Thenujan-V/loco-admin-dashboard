import { useState, useMemo, useCallback } from 'react';

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
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Label from 'src/components/label';

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import {
  normalizeCategoryItemsResponse,
  useCreateCategoryItemsMutation,
  useDeleteCategoryItemMutation,
  useGetCategoryItemsQuery,
} from 'src/store/category-items/category-item-api';

import FoodCategoryAddEditDialog, { FoodCategoryItem } from '../food-category-add-edit-dialog';

export default function FoodCategoryListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetCategoryItemsQuery();
  const [createCategoryItems] = useCreateCategoryItemsMutation();
  const [deleteCategoryItem] = useDeleteCategoryItemMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FoodCategoryItem | null>(null);

  const tableData = useMemo(
    () =>
      normalizeCategoryItemsResponse(data).map((item) => ({
        id: String(item.id),
        name: item.name,
        description: item.description,
        image: item.image,
        availability: item.availability,
      })),
    [data]
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRow = useCallback(async () => {
    if (!deleteTarget?.id) return;

    try {
      await deleteCategoryItem(deleteTarget.id).unwrap();
      enqueueSnackbar('Category deleted successfully.', { variant: 'success' });
      if (page > 0 && tableData.length - 1 <= page * rowsPerPage) {
        setPage(page - 1);
      }
      setDeleteTarget(null);
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || error?.message || 'Failed to delete category.', {
        variant: 'error',
      });
    }
  }, [deleteCategoryItem, deleteTarget, enqueueSnackbar, page, rowsPerPage, tableData.length]);

  const handleSaveCategories = useCallback(
    async (newItems: FoodCategoryItem[]) => {
      try {
        await createCategoryItems(
          newItems.map((item) => ({
            name: item.name,
            description: item.description,
            image: item.image instanceof File ? item.image : null,
            availability: item.availability ?? true,
          }))
        ).unwrap();

        enqueueSnackbar(
          `${newItems.length} categor${newItems.length > 1 ? 'ies' : 'y'} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to create categories.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createCategoryItems, enqueueSnackbar]
  );

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Food Categories</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading categories...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load categories from API.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => setOpenAddDialog(true)}
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
                        <Avatar
                          alt={row.name}
                          src={typeof row.image === 'string' ? row.image : ''}
                          variant="rounded"
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
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
                      <Label color={row.availability ? 'success' : 'error'} variant="soft">
                        {row.availability ? 'Available' : 'Unavailable'}
                      </Label>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => setDeleteTarget(row)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && !isLoading && (
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
          onClose={() => setOpenAddDialog(false)}
          onSave={handleSaveCategories}
        />
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {`Are you sure you want to delete ${deleteTarget?.name || 'this category'}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
