import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export default function OrderListView() {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Food Orders
      </Typography>

      <Card>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">Example Module: Orders</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            This is an example view for tracking food orders.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
