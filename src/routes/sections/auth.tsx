import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from 'src/auth/guard';
// layouts
import AuthClassicLayout from 'src/layouts/auth/classic';
// components
import { SplashScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

// JWT
const LoginPage = lazy(() => import('src/pages/auth/login'));
const RegisterPage = lazy(() => import('src/pages/auth/register'));
const OtpPage = lazy(() => import('src/pages/auth/otp'));
const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgot-password'));
const ForgotPasswordOtpPage = lazy(() => import('src/pages/auth/forgot-password-otp'));
const ForgotPasswordResetPage = lazy(() => import('src/pages/auth/forgot-password-reset'));

// ----------------------------------------------------------------------

const authJwt = {
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <LoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <RegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'otp',
      element: (
        <AuthClassicLayout>
          <OtpPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <AuthClassicLayout>
          <ForgotPasswordPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'forgot-password/otp',
      element: (
        <AuthClassicLayout>
          <ForgotPasswordOtpPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'forgot-password/reset-password',
      element: (
        <AuthClassicLayout>
          <ForgotPasswordResetPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
