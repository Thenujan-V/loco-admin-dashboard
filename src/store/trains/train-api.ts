import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type TrainRecord = {
  id: number | string;
  name: string;
  type: string;
};

export type TrainPayload = {
  name: string;
  type: string;
};

export const normalizeTrainsResponse = (data: any): TrainRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((train: any) => ({
    id: train.id,
    name: train.name || '',
    type: train.type || '',
  }));
};

export const trainApi = createApi({
  reducerPath: 'trainApi',
  baseQuery,
  tagTypes: ['trains'],
  endpoints: (builder) => ({
    getTrains: builder.query<any, void>({
      query: () => ({
        url: 'train/get',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['trains'],
    }),
    createTrain: builder.mutation<any, TrainPayload>({
      query: (body) => ({
        url: 'train/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['trains'],
    }),
    updateTrain: builder.mutation<any, { id: string | number; body: TrainPayload }>({
      query: ({ id, body }) => ({
        url: `train/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['trains'],
    }),
    deleteTrain: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `train/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['trains'],
    }),
  }),
});

export const {
  useGetTrainsQuery,
  useCreateTrainMutation,
  useUpdateTrainMutation,
  useDeleteTrainMutation,
} = trainApi;
