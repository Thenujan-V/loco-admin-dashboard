import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type RestaurantRecord = {
  id: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  status?: string;
};

export const normalizeRestaurantsResponse = (data: any): RestaurantRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((restaurant: any) => ({
    id: restaurant.id,
    name: restaurant.name || '',
    address: restaurant.address || '',
    email: restaurant.email || '',
    phoneNumber: restaurant.phoneNumber || '',
    isActive: Boolean(restaurant.isActive),
    status: restaurant.status || '',
  }));
};

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery,
  tagTypes: ['restaurants'],
  endpoints: (builder) => ({
    getRestaurants: builder.query<any, void>({
      query: () => ({
        url: 'admin/restaurant',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['restaurants'],
    }),
    toggleRestaurantStatus: builder.mutation<any, { userId: number | string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url: `admin/restaurant/${userId}`,
        method: 'PUT',
        body: { isActive },
      }),
      async onQueryStarted({ userId, isActive }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          restaurantApi.util.updateQueryData('getRestaurants', undefined, (draft: any) => {
            const restaurants = normalizeRestaurantsResponse(draft);
            const updated = restaurants.map((restaurant) =>
              String(restaurant.id) === String(userId) ? { ...restaurant, isActive } : restaurant
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
      invalidatesTags: ['restaurants'],
    }),
  }),
});

export const { useGetRestaurantsQuery, useToggleRestaurantStatusMutation } = restaurantApi;
