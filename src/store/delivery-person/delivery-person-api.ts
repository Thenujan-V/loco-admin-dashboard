import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type DeliveryPersonRecord = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status?: string;
};

export const normalizeDeliveryPersonsResponse = (data: any): DeliveryPersonRecord[] => {
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

export const deliveryPersonApi = createApi({
  reducerPath: 'deliveryPersonApi',
  baseQuery,
  tagTypes: ['deliveryPersons'],
  endpoints: (builder) => ({
    getDeliveryPersons: builder.query<any, void>({
      query: () => ({
        url: 'admin/delivery-person',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['deliveryPersons'],
    }),
    toggleDeliveryPersonStatus: builder.mutation<any, { userId: number | string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `admin/delivery-person/${userId}`,
        method: 'PUT',
        body: { isActive },
      }),
      async onQueryStarted({ userId, isActive }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          deliveryPersonApi.util.updateQueryData('getDeliveryPersons', undefined, (draft: any) => {
            const people = normalizeDeliveryPersonsResponse(draft);
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
      invalidatesTags: ['deliveryPersons'],
    }),
  }),
});

export const { useGetDeliveryPersonsQuery, useToggleDeliveryPersonStatusMutation } = deliveryPersonApi;
