// ...existing code...
import { MaterialDesignContent } from 'notistack';
// @mui
import { styled, alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledNotistack = styled(MaterialDesignContent)(({ theme }: { theme: Theme }) => {
  const isLight = theme.palette.mode === 'light';

  return {
    '& #notistack-snackbar': {
      ...theme.typography.subtitle2,
      padding: 0,
      flexGrow: 1,
    },
    '&.notistack-MuiContent': {
      padding: theme.spacing(0.5),
      paddingRight: theme.spacing(2),
      color: theme.palette.text.primary,
      boxShadow: theme.customShadows.z8,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
    },
    '&.notistack-MuiContent-default': {
      padding: theme.spacing(1),
      color: isLight ? theme.palette.common.white : theme.palette.grey[800],
      backgroundColor: isLight ? theme.palette.grey[800] : theme.palette.common.white,
    },
    // '&.notistack-MuiContent-info': {},
    // '&.notistack-MuiContent-success': {},
    // '&.notistack-MuiContent-warning': {},
    // '&.notistack-MuiContent-error': {},
  };
});

// ----------------------------------------------------------------------

export const StyledIcon = styled('span')<{ color: keyof Theme['palette'] }>(({ color, theme }) => {
  const paletteColor = (theme.palette as any)[color] ?? theme.palette.info;

  return {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
    color: paletteColor.main,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(paletteColor.main, 0.16),
  };
});
// ...existing code...