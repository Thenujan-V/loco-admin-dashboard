import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type RouteRecord = {
  id: number | string;
  name: string;
  lineId: number | null;
  startStationId: number | null;
  endStationId: number | null;
  isReverse: boolean;
};

export type RoutePayload = {
  name: string;
  lineId: number;
  startStationId: number;
  endStationId: number;
  isReverse: boolean;
};

export const normalizeRoutesResponse = (data: any): RouteRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((route: any) => ({
    id: route.id,
    name: route.name || '',
    lineId: route.lineId === null || route.lineId === undefined ? null : Number(route.lineId),
    startStationId:
      route.startStationId === null || route.startStationId === undefined
        ? null
        : Number(route.startStationId),
    endStationId:
      route.endStationId === null || route.endStationId === undefined
        ? null
        : Number(route.endStationId),
    isReverse: Boolean(route.isReverse),
  }));
};

export const routeApi = createApi({
  reducerPath: 'routeApi',
  baseQuery,
  tagTypes: ['routes'],
  endpoints: (builder) => ({
    getRoutes: builder.query<any, void>({
      query: () => ({
        url: 'route/get',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['routes'],
    }),
    createRoute: builder.mutation<any, RoutePayload>({
      query: (body) => ({
        url: 'route/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['routes'],
    }),
    updateRoute: builder.mutation<any, { id: string | number; body: RoutePayload }>({
      query: ({ id, body }) => ({
        url: `route/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['routes'],
    }),
    deleteRoute: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `route/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['routes'],
    }),
  }),
});

export const {
  useGetRoutesQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
} = routeApi;
