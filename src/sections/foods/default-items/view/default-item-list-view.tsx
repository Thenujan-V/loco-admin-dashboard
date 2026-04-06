import { useState, useCallback, useMemo } from 'react';

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

import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';
import {
  normalizeCategoryItemsResponse,
  useGetCategoryItemsQuery,
} from 'src/store/category-items/category-item-api';
import {
  normalizeDefaultItemsResponse,
  useCreateDefaultItemsBulkMutation,
  useGetDefaultItemsQuery,
  useToggleDefaultItemMutation,
  useUpdateDefaultItemMutation,
} from 'src/store/default-items/default-item-api';

import DefaultItemAddEditDialog, { FoodDefaultItem } from '../default-item-add-edit-dialog';

export default function FoodDefaultItemListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isError } = useGetDefaultItemsQuery();
  const { data: categoriesData } = useGetCategoryItemsQuery();
  const [createDefaultItemsBulk] = useCreateDefaultItemsBulkMutation();
  const [updateDefaultItem] = useUpdateDefaultItemMutation();
  const [toggleDefaultItem] = useToggleDefaultItemMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodDefaultItem | null>(null);

  const tableData = useMemo(
    () =>
      normalizeDefaultItemsResponse(data).map((item) => ({
        id: String(item.id),
        name: item.name,
        description: item.description,
        categoryId: String(item.categoryId ?? ''),
        image: item.image,
        availability: item.availability,
      })),
    [data]
  );

  const categoryOptions = useMemo(
    () =>
      normalizeCategoryItemsResponse(categoriesData).map((item) => ({
        id: String(item.id),
        name: item.name,
      })),
    [categoriesData]
  );

  const categoryMap = useMemo(
    () => new Map(categoryOptions.map((item) => [item.id, item.name])),
    [categoryOptions]
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
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

  const handleAvailabilityToggle = useCallback(
    async (id: string) => {
      try {
        await toggleDefaultItem(id).unwrap();
        enqueueSnackbar('Item availability updated successfully.', { variant: 'success' });
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to toggle item availability.', {
          variant: 'error',
        });
      }
    },
    [enqueueSnackbar, toggleDefaultItem]
  );

  const handleSaveItems = useCallback(
    async (newItems: FoodDefaultItem[]) => {
      try {
        if (currentItem?.id) {
          const updatedItem = newItems[0];

          await updateDefaultItem({
            id: currentItem.id,
            body: {
              name: updatedItem.name,
              description: updatedItem.description,
              categoryId: updatedItem.categoryId,
              image: updatedItem.image,
              availability: updatedItem.availability,
            },
          }).unwrap();

          enqueueSnackbar('Default item updated successfully.', { variant: 'success' });
          return;
        }

        await createDefaultItemsBulk(
          newItems.map((item) => ({
            name: item.name,
            description: item.description,
            categoryId: item.categoryId,
            image: item.image,
            availability: item.availability ?? true,
          }))
        ).unwrap();

        enqueueSnackbar(
          `${newItems.length} default item${newItems.length > 1 ? 's' : ''} created successfully.`,
          { variant: 'success' }
        );
      } catch (error: any) {
        enqueueSnackbar(error?.data?.message || error?.message || 'Failed to save default items.', {
          variant: 'error',
        });
        throw error;
      }
    },
    [createDefaultItemsBulk, currentItem?.id, enqueueSnackbar, updateDefaultItem]
  );

  const handleNewConfig = () => {
    setCurrentItem(null);
    setOpenAddDialog(true);
  };

  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getCategoryName = (id: string) => categoryMap.get(id) || 'Unknown Category';

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 5 }}>
          <Box>
            <Typography variant="h4">Default Items</Typography>
            {isLoading && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Loading default items...
              </Typography>
            )}
            {isError && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                Failed to load default items from API.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleNewConfig}
            disabled={!categoryOptions.length}
          >
            Add New Item
          </Button>
        </Box>

        {!categoryOptions.length && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Create at least one food category before adding default items.
          </Typography>
        )}

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
                        <Avatar alt={row.name} src={typeof row.image === 'string' ? row.image : ''} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />
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
                        onChange={() => handleAvailabilityToggle(row.id as string)}
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

                {tableData.length === 0 && !isLoading && (
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
          options={categoryOptions}
        />
      )}
    </>
  );
}
