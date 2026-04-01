const ADMIN_LOGIN_URL = 'http://localhost:3001/admin/login';

type LoginPayload = {
  email: string;
  password: string;
};

type NormalizedLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: any;
  raw: any;
};

function pickAccessToken(payload: any): string {
  return (
    payload?.accessToken ||
    payload?.token ||
    payload?.content?.accessToken ||
    payload?.content?.token ||
    payload?.data?.accessToken ||
    payload?.data?.token ||
    payload?.data ||
    '' 
  );
}

function pickRefreshToken(payload: any): string {
  return (
    payload?.refreshToken ||
    payload?.content?.refreshToken ||
    payload?.data?.refreshToken ||
    ''
  );
}

function pickUser(payload: any, email: string) {
  return (
    payload?.user ||
    payload?.admin ||
    payload?.content?.user ||
    payload?.content?.admin ||
    payload?.data?.user ||
    payload?.data?.admin ||
    {
      email,
      role: 'admin',
    }
  );
}

export async function adminLogin(payload: LoginPayload): Promise<NormalizedLoginResponse> {
  const response = await fetch(ADMIN_LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Login failed');
  }

  const accessToken = pickAccessToken(data);

  if (!accessToken) {
    throw new Error('Login succeeded but no access token was returned');
  }

  return {
    accessToken,
    refreshToken: pickRefreshToken(data),
    user: pickUser(data, payload.email),
    raw: data,
  };
}
