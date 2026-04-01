import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type UserRecord = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status?: string;
  isVerified?: boolean;
  createdAt?: string;
};

export const normalizeUsersResponse = (data: any): UserRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((user: any) => ({
    id: user.id,
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    isActive: Boolean(user.isActive),
    status: user.status || '',
    isVerified:
      typeof user.isVerified === 'boolean' ? user.isVerified : user.status === 'APPROVED',
    createdAt: user.createdAt,
  }));
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['users'],
  endpoints: (builder) => ({
    getUsers: builder.query<any, void>({
      query: () => ({
        url: 'admin/user',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['users'],
    }),
    toggleUserStatus: builder.mutation<any, { userId: number | string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `admin/user/${userId}`,
        method: 'PUT',
        body: { isActive },
      }),
      async onQueryStarted({ userId, isActive }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getUsers', undefined, (draft: any) => {
            const users = normalizeUsersResponse(draft);
            const updatedUsers = users.map((user) =>
              String(user.id) === String(userId) ? { ...user, isActive } : user
            );

            if (Array.isArray(draft)) {
              return updatedUsers;
            }
            if (Array.isArray(draft?.content)) {
              draft.content = updatedUsers;
              return;
            }
            if (Array.isArray(draft?.data)) {
              draft.data = updatedUsers;
              return;
            }
            if (Array.isArray(draft?.rows)) {
              draft.rows = updatedUsers;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['users'],
    }),
  }),
});

export const { useGetUsersQuery, useToggleUserStatusMutation } = userApi;
