// @mui
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';


// assets
import { ComingSoonIllustration } from 'src/assets/illustrations';
// components

// ----------------------------------------------------------------------

export default function ComingSoonView() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Coming Soon!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working hard on this page!
      </Typography>

      <ComingSoonIllustration sx={{ my: 10, height: 240 }} />
    </Box>
  );
}

