import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type PickupPersonRecord = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status?: string;
};

export const normalizePickupPersonsResponse = (data: any): PickupPersonRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((person: any) => ({
    id: person.id,
    firstname: person.firstname || '',
    lastname: person.lastname || '',
    email: person.email || '',
    phoneNumber: person.phoneNumber || '',
    isActive: Boolean(person.isActive),
    status: person.status || '',
  }));
};

export const pickupPersonApi = createApi({
  reducerPath: 'pickupPersonApi',
  baseQuery,
  tagTypes: ['pickupPersons'],
  endpoints: (builder) => ({
    getPickupPersons: builder.query<any, void>({
      query: () => ({
        url: 'admin/pickup-person',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['pickupPersons'],
    }),
    togglePickupPersonStatus: builder.mutation<any, { userId: number | string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `admin/pickup-person/${userId}`,
        method: 'PUT',
        body: { isActive },
      }),
      async onQueryStarted({ userId, isActive }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          pickupPersonApi.util.updateQueryData('getPickupPersons', undefined, (draft: any) => {
            const people = normalizePickupPersonsResponse(draft);
            const updated = people.map((person) =>
              String(person.id) === String(userId) ? { ...person, isActive } : person
            );

            if (Array.isArray(draft)) return updated;
            if (Array.isArray(draft?.content)) {
              draft.content = updated;
              return;
            }
            if (Array.isArray(draft?.data)) {
              draft.data = updated;
              return;
            }
            if (Array.isArray(draft?.rows)) {
              draft.rows = updated;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['pickupPersons'],
    }),
  }),
});

export const { useGetPickupPersonsQuery, useTogglePickupPersonStatusMutation } = pickupPersonApi;
