import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type ScheduleRecord = {
  id: number | string;
  trainId: number | null;
  routeId: number | null;
  day: string[];
  dayOffset: number | null;
};

export type SchedulePayload = {
  trainId: number;
  routeId: number;
  day: string[];
  dayOffset: number;
};

export const normalizeSchedulesResponse = (data: any): ScheduleRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : [];

  return source.map((schedule: any) => ({
    id: schedule.id,
    trainId:
      schedule.trainId === null || schedule.trainId === undefined ? null : Number(schedule.trainId),
    routeId:
      schedule.routeId === null || schedule.routeId === undefined ? null : Number(schedule.routeId),
    day: Array.isArray(schedule.day) ? schedule.day : [],
    dayOffset:
      schedule.dayOffset === null || schedule.dayOffset === undefined
        ? null
        : Number(schedule.dayOffset),
  }));
};

export const normalizeSingleScheduleResponse = (data: any): ScheduleRecord | null => {
  if (!data || Array.isArray(data)) return null;

  return {
    id: data.id,
    trainId: data.trainId === null || data.trainId === undefined ? null : Number(data.trainId),
    routeId: data.routeId === null || data.routeId === undefined ? null : Number(data.routeId),
    day: Array.isArray(data.day) ? data.day : [],
    dayOffset:
      data.dayOffset === null || data.dayOffset === undefined ? null : Number(data.dayOffset),
  };
};

export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
  baseQuery,
  tagTypes: ['schedules'],
  endpoints: (builder) => ({
    getSchedules: builder.query<any, void>({
      query: () => ({
        url: 'schedule/get',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['schedules'],
    }),
    getScheduleById: builder.query<any, string | number>({
      query: (id) => ({
        url: `schedule/get/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, id) => [{ type: 'schedules', id: String(id) }],
    }),
    createSchedule: builder.mutation<any, SchedulePayload>({
      query: (body) => ({
        url: 'schedule/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['schedules'],
    }),
    updateSchedule: builder.mutation<any, { id: string | number; body: SchedulePayload }>({
      query: ({ id, body }) => ({
        url: `schedule/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => ['schedules', { type: 'schedules', id: String(arg.id) }],
    }),
    deleteSchedule: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `schedule/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['schedules'],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;
