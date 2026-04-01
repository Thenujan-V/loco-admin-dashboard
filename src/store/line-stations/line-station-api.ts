import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type LineStationRecord = {
  id: number | string;
  stationId: number | null;
  lineOrder: number | null;
};

export type LineStationCreatePayload = {
  lineId: number;
  stations: Array<{
    stationId: number;
    lineOrder: number;
  }>;
};

export const normalizeLineStationsResponse = (data: any): LineStationRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.stations)
      ? data.stations
      : Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.rows)
            ? data.rows
            : [];

  return source.map((station: any, index: number) => ({
    id: station.id ?? `${station.stationId ?? 'station'}-${station.lineOrder ?? index}`,
    stationId:
      station.stationId === null || station.stationId === undefined
        ? null
        : Number(station.stationId),
    lineOrder:
      station.lineOrder === null || station.lineOrder === undefined
        ? null
        : Number(station.lineOrder),
  }));
};

export const lineStationApi = createApi({
  reducerPath: 'lineStationApi',
  baseQuery,
  tagTypes: ['lineStations'],
  endpoints: (builder) => ({
    getLineStations: builder.query<any, string | number>({
      query: (lineId) => ({
        url: `line-station/get/${lineId}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, lineId) => [{ type: 'lineStations', id: String(lineId) }],
    }),
    createLineStation: builder.mutation<any, LineStationCreatePayload>({
      query: (body) => ({
        url: 'line-station/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, body) => [{ type: 'lineStations', id: String(body.lineId) }],
    }),
    deleteLineStation: builder.mutation<any, { id: string | number; lineId: string | number }>({
      query: ({ id }) => ({
        url: `line-station/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'lineStations', id: String(arg.lineId) }],
    }),
  }),
});

export const {
  useGetLineStationsQuery,
  useCreateLineStationMutation,
  useDeleteLineStationMutation,
} = lineStationApi;
