import { IconButton } from '@mui/material';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { varHover } from 'src/components/animate';
// @mui
// components
import { useSettingsContext } from 'src/components/settings';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function SettingsButton() {
  const settings = useSettingsContext();

  return (
    <IconButton
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      onClick={() => settings.onUpdate('themeMode', settings.themeMode === 'light' ? 'dark' : 'light')}
      sx={{
        width: 40,
        height: 40,
      }}
    >
      <SvgColor src={`/assets/icons/setting/ic_${settings.themeMode === 'light' ? 'sun' : 'moon'}.svg`} />
    </IconButton>

  );
}

SettingsButton.propTypes = {
  sx: PropTypes.object,
};
