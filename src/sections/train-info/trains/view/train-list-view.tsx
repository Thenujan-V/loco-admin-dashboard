import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export default function TrainListView() {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Trains
      </Typography>

      <Card>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">Trains Module (Coming Soon)</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            This is a placeholder for the trains management view.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
}
