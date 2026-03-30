import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export default function UserListView() {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Users Management
      </Typography>

      <Card>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">Example Module: Users</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            This is an example view for User Management without any core implementations.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
