// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export interface JwtPayload {
  exp?: number; // expiration time
  iat?: number; // issued at
  [key: string]: any; // other custom claims
}

export function jwtDecode(token: string): JwtPayload | null {
  if (token === 'mockToken') {
    return {
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    };
  }
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid JWT token', error);
    return null;
  }
}


// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  let expiredTimer: ReturnType<typeof setTimeout>;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer!);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('accessToken');

    window.location.href = paths.auth.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);

    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // tokenExpired(exp);
  } else {
    sessionStorage.removeItem('accessToken');
  }
};
