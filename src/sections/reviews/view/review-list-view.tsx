import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import TableContainer from '@mui/material/TableContainer';
import DialogContent from '@mui/material/DialogContent';
import TablePagination from '@mui/material/TablePagination';
import DialogActions from '@mui/material/DialogActions';
import { useSnackbar } from 'notistack';

import Iconify from 'src/components/iconify';

type ReviewRow = {
  id: string;
  userName: string;
  restaurantName: string;
  rating: number;
  comment: string;
  reply: string;
};

const MOCK_REVIEWS: ReviewRow[] = [
  {
    id: 'REV-1001',
    userName: 'Nimal Perera',
    restaurantName: 'Spicy Loco Kitchen',
    rating: 5,
    comment: 'Fast delivery and the kottu was still hot when it arrived.',
    reply: 'Thank you for the kind words. We are glad you enjoyed it!',
  },
  {
    id: 'REV-1002',
    userName: 'Aisha Fernando',
    restaurantName: 'Burger Station',
    rating: 3,
    comment: 'Burger was good, but the fries were a little soggy.',
    reply: 'Thanks for the feedback. We are improving our packaging for fries.',
  },
  {
    id: 'REV-1003',
    userName: 'Kasun Jayasekara',
    restaurantName: 'Ocean Bite',
    rating: 4,
    comment: 'Tasty seafood rice and generous portion size.',
    reply: 'Appreciate your review. Hope to serve you again soon.',
  },
  {
    id: 'REV-1004',
    userName: 'Tharushi Silva',
    restaurantName: 'Green Bowl Cafe',
    rating: 2,
    comment: 'The order was delayed and the smoothie was missing.',
    reply: 'We are sorry about the experience. Please contact support for help.',
  },
];

export default function ReviewListView() {
  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState<ReviewRow[]>(MOCK_REVIEWS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);

  const paginatedData = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableData]
  );

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleDeleteClick = useCallback((review: ReviewRow) => {
    setSelectedReview(review);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedReview(null);
  }, []);

  const handleDeleteReview = useCallback(() => {
    if (!selectedReview) return;

    setTableData((prev) => prev.filter((review) => review.id !== selectedReview.id));
    setPage((prevPage) => {
      const nextCount = tableData.length - 1;
      const maxPage = Math.max(0, Math.ceil(nextCount / rowsPerPage) - 1);
      return Math.min(prevPage, maxPage);
    });
    enqueueSnackbar(`Review ${selectedReview.id} deleted successfully.`, { variant: 'success' });
    setSelectedReview(null);
  }, [enqueueSnackbar, rowsPerPage, selectedReview, tableData.length]);

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Reviews</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Admin can review customer feedback and remove inappropriate reviews from this section.
        </Typography>
      </Box>

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'auto' }}>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell>Review Id</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Restaurent Name</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Reply</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Chip label={row.id} size="small" variant="outlined" color="info" />
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">{row.userName}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{row.restaurantName}</Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={row.rating} precision={0.5} readOnly />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {row.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 260,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {row.comment}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 260,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: 'text.secondary',
                      }}
                    >
                      {row.reply}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {!tableData.length && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="subtitle1">No reviews found</Typography>
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

      <Dialog open={!!selectedReview} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {selectedReview
              ? `Are you sure you want to delete review ${selectedReview.id} from ${selectedReview.userName}?`
              : 'Are you sure you want to delete this review?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteReview}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
