import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image = '', title = '' }) {
  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const renderContent = (
    <Stack
    justifyContent="center"
    sx={{
      width: 1,
      mx: 'auto',
      maxWidth: 480,
      px: { xs: 2, md: 8 },
      height: '100vh',
    }}
  >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={5}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
        {title || 'Hi, Welcome to Ceylon Reload!'}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={'/logo/logo_single.png'}
        sx={{ maxWidth: 700 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
