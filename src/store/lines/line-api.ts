import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type LineRecord = {
  id: number | string;
  name: string;
  startStationId: number | null;
  endStationId: number | null;
};

export type LinePayload = {
  name: string;
  startStationId: number;
  endStationId: number;
};

export const normalizeLinesResponse = (data: any): LineRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((line: any) => ({
    id: line.id,
    name: line.name || '',
    startStationId:
      line.startStationId === null || line.startStationId === undefined
        ? null
        : Number(line.startStationId),
    endStationId:
      line.endStationId === null || line.endStationId === undefined
        ? null
        : Number(line.endStationId),
  }));
};

export const lineApi = createApi({
  reducerPath: 'lineApi',
  baseQuery,
  tagTypes: ['lines'],
  endpoints: (builder) => ({
    getLines: builder.query<any, void>({
      query: () => ({
        url: 'line/get',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['lines'],
    }),
    createLine: builder.mutation<any, LinePayload>({
      query: (body) => ({
        url: 'line/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['lines'],
    }),
    updateLine: builder.mutation<any, { id: string | number; body: LinePayload }>({
      query: ({ id, body }) => ({
        url: `line/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['lines'],
    }),
    deleteLine: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `line/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['lines'],
    }),
  }),
});

export const {
  useGetLinesQuery,
  useCreateLineMutation,
  useUpdateLineMutation,
  useDeleteLineMutation,
} = lineApi;
