import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface SvgColorProps {
  src: string;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

const SvgColor = forwardRef<HTMLElement, SvgColorProps>(({ src, sx, ...other }, ref) => (
  <Box
    component="span"
    className="svg-color"
    ref={ref}
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
));

SvgColor.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object,
};

export default SvgColor;
