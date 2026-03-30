import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface IconifyProps {
  icon: string | React.ReactElement;
  width?: number;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

const Iconify = forwardRef<HTMLElement, IconifyProps>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  width: PropTypes.number,
};

export default Iconify;
