/* eslint-disable react-hooks/preserve-manual-memoization */
import { ReactNode } from 'react';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
//
import { AuthContext } from './auth-context';
import { isValidToken, jwtDecode, setSession } from './utils';
import { getOrCreateDeviceId } from 'src/utils/device';
import register from 'src/pages/auth/register';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useVerifyUserMutation, useVerifyDeviceMutation, useResendOtpMutation } from 'src/store/auth/auth-api';
// ----------------------------------------------------------------------

const initialState = {
  user: null as any,
  loading: true,
};

const reducer = (state: typeof initialState, action: any) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const STORAGE_USER_KEY = 'user';
const DEVICE_ID_KEY = 'deviceId';
const REFRESH_TOKEN_KEY = 'refreshToken';


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [verifyUser] = useVerifyUserMutation();
  const [verifyOtp] = useVerifyDeviceMutation();
  const [resendOtp] = useResendOtpMutation();

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    // localStorage.removeItem(DEVICE_ID_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);

    dispatch({ type: 'LOGOUT' });
    router.push(paths.auth.login)
  }, [router]);


  //Handle Renew Token
  const refreshTokenNow = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const deviceId = localStorage.getItem(DEVICE_ID_KEY);

      if (!refreshToken || !deviceId) return;

      const response = await verifyUser({
        grantType: "refreshToken",
        refreshToken,
        deviceId,
      }).unwrap();
      const { accessToken, refreshToken: newRefresh } = response.content;

      // Save new tokens
      localStorage.setItem(STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.content));
      const user = response.content;
      // Reset session with new expiry
      setSession(accessToken);
      dispatch({
        type: 'INITIAL',
        payload: {
          user,
        },
      });
    } catch (error) {
      console.error("Renew token failed", error);
      logout();
    }
  }, [logout, verifyUser]);

  //Handle Renew Token
  useEffect(() => {
    const handleTokenRefresh = async () => {
      const token = localStorage.getItem(STORAGE_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const deviceId = localStorage.getItem(DEVICE_ID_KEY);

      if (!token || !refreshToken || !deviceId) return;

      const decoded = jwtDecode(token);
      if (!decoded) return;
      const currentTime = Date.now() / 1000;
      const timeLeft = (decoded.exp! - currentTime) * 1000;

      // If token already expired, refresh immediately
      if (timeLeft <= 0) {
        await refreshTokenNow();
        return;
      }

      // Refresh a little before expiry (e.g., 10 seconds early)
      const refreshTimer = setTimeout(async () => {
        await refreshTokenNow();
      }, timeLeft - 10000); // refresh 10 seconds before expiry

      return () => clearTimeout(refreshTimer);
    };

    handleTokenRefresh();
  }, [refreshTokenNow]);


  //Renew Token Without Logout
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!token || !refreshToken || !deviceId) return;

    const decoded = jwtDecode(token);
    if (!decoded) return;
    const { exp } = decoded;

    const currentTime = Date.now() / 1000;
    const timeLeft = (exp - currentTime) * 1000;

    if (timeLeft <= 0) {
      refreshTokenNow();
      return;
    }

    const timer = setTimeout(() => {
      refreshTokenNow();
    }, timeLeft);

    return () => clearTimeout(timer);

  }, [refreshTokenNow]);



  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEY);
      const user = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');

      if (accessToken && user && isValidToken(accessToken)) {
        setSession(accessToken);
        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // SENDOTP
  const sendOtp = useCallback(async (phoneNumber, password) => {
    try {
      const deviceId = getOrCreateDeviceId();
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || '';
      const body = {
        username: phoneNumber,
        password: password,
        grantType: 'password',
        refreshToken: refreshToken,
        deviceId: deviceId,
      };
      const response = await verifyUser(body).unwrap();
      if (!response.content.isDeviceVerificationRequired) {
        //if device verification is not required, we can directly log in the user
        setSession(response.content.accessToken);
        localStorage.setItem('accessToken', response.content.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.content.refreshToken);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.content));

        dispatch({
          type: 'LOGIN',
          payload: {
            user: response.content,
          },
        });
        router.push(paths.dashboard.root)
      }
    } catch (err: any) {
      const backendMessage =
        err?.data?.message ||
        "Login failed";

      throw new Error(backendMessage); // send to UI
    }
  }, [router, verifyUser]);

  // SENDOTP
  const ResendOtp = useCallback(
    async (phoneNumber: string, deviceId: string): Promise<void> => {
      try {
        const body = { username: phoneNumber, deviceId };
        await resendOtp(body).unwrap(); // Assuming resendOtp is RTK Query mutation
        enqueueSnackbar('Resend OTP success!', { variant: 'success' });
      } catch (err: any) {

        // Extract backend error safely
        const backendMessage =
          err?.data?.message || 'Resend OTP failed';

        // Throw error to be caught by parent UI
        throw new Error(backendMessage);
      }
    },
    [resendOtp]
  );

  interface LoginResponse {
    content: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      username: string;
      role: string;
      isDeviceVerificationRequired: boolean;
    }
  }

  // LOGIN
  const verifyOtpCode = useCallback(async (otpCode, phoneNumber) => {
    try {
      const deviceId = getOrCreateDeviceId();
      const body = {
        otpCode: otpCode,
        deviceId: deviceId,
        username: phoneNumber
      };
      const response: LoginResponse = await verifyOtp(body).unwrap();
      const user = response.content
      setSession(response.content.accessToken);
      // ✅ Save refresh token
      localStorage.setItem('accessToken', response.content.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.content.refreshToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));

      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (err: any) {
      const backendMessage =
        err?.data?.message ||
        "OTP Invalid";

      throw new Error(backendMessage); // send to UI
    }
  }, [verifyOtp]);

  // REGISTER
  // const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
  //   // TODO: Replace with RTK Query mutation
  //   const accessToken = '';
  //   const user = null;

  //   sessionStorage.setItem(STORAGE_KEY, accessToken);

  //   dispatch({
  //     type: 'REGISTER',
  //     payload: {
  //       user,
  //     },
  //   });
  // }, []);


  // UPDATE USER PERMISSION
  // const updateUserPermission = useCallback(async (permissions) => {
  //   const user = JSON.parse(localStorage.getItem(STORAGE_USER_KEY));
  //   user.permissions = permissions;
  //   localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  //   dispatch({
  //     type: 'INITIAL',
  //     payload: {
  //       user,
  //     },
  //   });
  // }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      sendOtp,
      verifyOtpCode,
      register,
      logout,
      ResendOtp,
    }),
    [state.user, status, sendOtp, verifyOtpCode, logout, ResendOtp]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
