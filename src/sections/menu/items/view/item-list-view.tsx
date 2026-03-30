import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export default function ItemListView() {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Menu Items
      </Typography>

      <Card>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">Example Module: Items</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            This is an example view for managing menu items.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
