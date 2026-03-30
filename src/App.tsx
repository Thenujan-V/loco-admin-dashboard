// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// routes
import Router from 'src/routes/sections';
// theme
import ThemeProvider from 'src/theme';
// hooks
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { SnackbarProvider } from './components/snackbar';
// components
import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsProvider } from 'src/components/settings';
// auth
import { AuthProvider, AuthConsumer } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export default function App() {
    useScrollToTop();

    return (
        <AuthProvider>
            <SettingsProvider
                defaultSettings={{
                    themeMode: 'light', // 'light' | 'dark'
                    themeDirection: 'ltr', //  'rtl' | 'ltr'
                    themeContrast: 'default', // 'default' | 'bold'
                    themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: 'cyan', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: true,
                }}
            >
                <ThemeProvider>
                    <MotionLazy>
                    <SnackbarProvider>
                        {/* <SettingsDrawer /> */}
                        <ProgressBar />
                        <AuthConsumer>
                            <Router />
                        </AuthConsumer>
                     </SnackbarProvider>
                    </MotionLazy>
                </ThemeProvider>
            </SettingsProvider>
        </AuthProvider>
    );
}
