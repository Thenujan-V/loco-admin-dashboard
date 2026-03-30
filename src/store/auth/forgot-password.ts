export const forgotApi: any = {
  reducerPath: 'forgotApi',
  reducer: (state: any = {}) => state,
  middleware: () => (next: any) => (action: any) => next(action),
};

export const useRequestOtpMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({})
  })
];

export const useVerifyOtpInForgotMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({
      content: { resetToken: 'mockToken' }
    })
  })
];

export const useResetPasswordMutation = () => [
  (body: any) => ({
    unwrap: () => Promise.resolve({})
  })
];
