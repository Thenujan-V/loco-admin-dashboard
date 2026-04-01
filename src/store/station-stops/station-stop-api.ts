import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type StationStopRecord = {
  id: number | string;
  stationId: number | null;
  stopOrder: number | null;
  arrivalTime: string;
  arrivalDayOffset: number | null;
  departureTime: string;
  departureDayOffset: number | null;
};

export type StationStopCreatePayload = {
  scheduleId: number;
  stops: Array<{
    stationId: number;
    stopOrder: number;
    arrivalTime: string;
    arrivalDayOffset: number;
    departureTime: string;
    departureDayOffset: number;
  }>;
};

export type StationStopUpdatePayload = {
  scheduleId: number;
  stops: Array<{
    id: number | string;
    arrivalTime: string;
    arrivalDayOffset: number;
    departureTime: string;
    departureDayOffset: number;
  }>;
};

export const normalizeStationStopsResponse = (data: any): StationStopRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.stops)
      ? data.stops
      : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.rows)
            ? data.rows
            : [];

  return source.map((stop: any, index: number) => ({
    id: stop.id ?? `${stop.stationId ?? 'stop'}-${stop.stopOrder ?? index}`,
    stationId: stop.stationId === null || stop.stationId === undefined ? null : Number(stop.stationId),
    stopOrder: stop.stopOrder === null || stop.stopOrder === undefined ? null : Number(stop.stopOrder),
    arrivalTime: stop.arrivalTime || '',
    arrivalDayOffset:
      stop.arrivalDayOffset === null || stop.arrivalDayOffset === undefined
        ? null
        : Number(stop.arrivalDayOffset),
    departureTime: stop.departureTime || '',
    departureDayOffset:
      stop.departureDayOffset === null || stop.departureDayOffset === undefined
        ? null
        : Number(stop.departureDayOffset),
  }));
};

export const stationStopApi = createApi({
  reducerPath: 'stationStopApi',
  baseQuery,
  tagTypes: ['stationStops'],
  endpoints: (builder) => ({
    getStationStops: builder.query<any, string | number>({
      query: (scheduleId) => ({
        url: `station-stop/get/${scheduleId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, scheduleId) => [{ type: 'stationStops', id: String(scheduleId) }],
    }),
    createStationStops: builder.mutation<any, StationStopCreatePayload>({
      query: (body) => ({
        url: 'station-stop/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [{ type: 'stationStops', id: String(body.scheduleId) }],
    }),
    updateStationStops: builder.mutation<any, StationStopUpdatePayload>({
      query: (body) => ({
        url: 'station-stop/update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [{ type: 'stationStops', id: String(body.scheduleId) }],
    }),
    deleteStationStop: builder.mutation<any, { id: string | number; scheduleId: string | number }>({
      query: ({ id }) => ({
        url: `station-stop/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'stationStops', id: String(arg.scheduleId) }],
    }),
  }),
});

export const {
  useGetStationStopsQuery,
  useCreateStationStopsMutation,
  useUpdateStationStopsMutation,
  useDeleteStationStopMutation,
} = stationStopApi;
