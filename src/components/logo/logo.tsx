import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps<Theme>;
}

const Logo = forwardRef<HTMLElement, LogoProps>(({ disabledLink = false, sx}, ref) => {

  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      component="img"
      src="/logo/logo_single.png"
      sx={{ width: 80, height: 80, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
