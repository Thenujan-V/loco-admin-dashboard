export const authApi: any = {
  reducerPath: 'authApi',
  reducer: (state: any = {}) => state,
  middleware: () => (next: any) => (action: any) => next(action),
};

export const useVerifyUserMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({
      content: {
        isDeviceVerificationRequired: false,
        accessToken: 'mockToken',
        refreshToken: 'mockRefresh',
        username: 'admin',
        role: 'admin',
        expiresIn: 3600
      }
    })
  })
];

export const useVerifyDeviceMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({
      content: {
        accessToken: 'mockToken',
        refreshToken: 'mockRefresh',
        username: 'admin',
        role: 'admin',
        expiresIn: 3600,
        isDeviceVerificationRequired: false
      }
    })
  })
];

export const useResendOtpMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({})
  })
];
