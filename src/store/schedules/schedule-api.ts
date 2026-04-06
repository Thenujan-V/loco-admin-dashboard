import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type ScheduleRecord = {
  id: number | string;
  trainId: number | null;
  routeId: number | null;
  day: string[];
  dayOffset: number | null;
  train: {
    id: number | string;
    name: string;
    type: string;
  } | null;
  route: {
    id: number | string;
    name: string;
    isReverse: boolean;
    lineId: number | null;
    startStationId: number | null;
    endStationId: number | null;
  } | null;
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
    train: schedule.Train
      ? {
          id: schedule.Train.id,
          name: schedule.Train.name || '',
          type: schedule.Train.type || '',
        }
      : null,
    route: schedule.Route
      ? {
          id: schedule.Route.id,
          name: schedule.Route.name || '',
          isReverse: Boolean(schedule.Route.isReverse),
          lineId:
            schedule.Route.lineId === null || schedule.Route.lineId === undefined
              ? null
              : Number(schedule.Route.lineId),
          startStationId:
            schedule.Route.startStationId === null || schedule.Route.startStationId === undefined
              ? null
              : Number(schedule.Route.startStationId),
          endStationId:
            schedule.Route.endStationId === null || schedule.Route.endStationId === undefined
              ? null
              : Number(schedule.Route.endStationId),
        }
      : null,
  }));
};

export const normalizeSingleScheduleResponse = (data: any): ScheduleRecord | null => {
  if (!data || Array.isArray(data)) return null;

  const source = data?.data && !Array.isArray(data.data) ? data.data : data;

  return {
    id: source.id,
    trainId: source.trainId === null || source.trainId === undefined ? null : Number(source.trainId),
    routeId: source.routeId === null || source.routeId === undefined ? null : Number(source.routeId),
    day: Array.isArray(source.day) ? source.day : [],
    dayOffset:
      source.dayOffset === null || source.dayOffset === undefined ? null : Number(source.dayOffset),
    train: source.Train
      ? {
          id: source.Train.id,
          name: source.Train.name || '',
          type: source.Train.type || '',
        }
      : null,
    route: source.Route
      ? {
          id: source.Route.id,
          name: source.Route.name || '',
          isReverse: Boolean(source.Route.isReverse),
          lineId:
            source.Route.lineId === null || source.Route.lineId === undefined
              ? null
              : Number(source.Route.lineId),
          startStationId:
            source.Route.startStationId === null || source.Route.startStationId === undefined
              ? null
              : Number(source.Route.startStationId),
          endStationId:
            source.Route.endStationId === null || source.Route.endStationId === undefined
              ? null
              : Number(source.Route.endStationId),
        }
      : null,
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
