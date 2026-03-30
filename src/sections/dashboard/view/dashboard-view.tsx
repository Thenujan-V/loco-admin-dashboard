// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import ComingSoonPage from 'src/pages/coming-soon';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <ComingSoonPage />
    </Container>
  );
}
