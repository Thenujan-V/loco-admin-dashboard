import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type StationRecord = {
  id: number | string;
  name: string;
  locationLongitude: number;
  locationLatitude: number;
};

export type StationPayload = {
  name: string;
  locationLongitude: number;
  locationLatitude: number;
};

export const normalizeStationsResponse = (data: any): StationRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((station: any) => ({
    id: station.id,
    name: station.name || '',
    locationLongitude: Number(station.locationLongitude ?? 0),
    locationLatitude: Number(station.locationLatitude ?? 0),
  }));
};

export const stationApi = createApi({
  reducerPath: 'stationApi',
  baseQuery,
  tagTypes: ['stations'],
  endpoints: (builder) => ({
    getStations: builder.query<any, void>({
      query: () => ({
        url: 'station/get',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['stations'],
    }),
    createStation: builder.mutation<any, StationPayload>({
      query: (body) => ({
        url: 'station/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['stations'],
    }),
    updateStation: builder.mutation<any, { id: string | number; body: StationPayload }>({
      query: ({ id, body }) => ({
        url: `station/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['stations'],
    }),
    deleteStation: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `station/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['stations'],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useCreateStationMutation,
  useUpdateStationMutation,
  useDeleteStationMutation,
} = stationApi;
