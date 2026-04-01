import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type DefaultItemRecord = {
  id: number | string;
  name: string;
  description: string;
  categoryId: number | string | null;
  image: string;
  availability: boolean;
};

export type DefaultItemInput = {
  name: string;
  description: string;
  categoryId: number | string;
  image: File | string | null;
  availability?: boolean;
};

export const normalizeDefaultItemsResponse = (data: any): DefaultItemRecord[] => {
  const source = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.rows)
          ? data.rows
          : data?.data && !Array.isArray(data.data)
            ? [data.data]
            : [];

  return source.map((item: any) => ({
    id: item.id,
    name: item.name || '',
    description: item.description || '',
    categoryId:
      item.categoryId === null || item.categoryId === undefined
        ? item.categoryItemId === null || item.categoryItemId === undefined
          ? null
          : item.categoryItemId
        : item.categoryId,
    image: item.image || item.imageUrl || item.fileUrl || item.url || '',
    availability:
      item.isAvailable === null || item.isAvailable === undefined
        ? true
        : Boolean(item.isAvailable),
  }));
};

const toDefaultItemsBulkFormData = (items: DefaultItemInput[]) => {
  const formData = new FormData();
  const defaultItems = items.map((item) => ({
    name: item.name,
    description: item.description,
    categoryId: Number(item.categoryId),
    isAvailable: item.availability ?? true,
  }));

  formData.append('defaultItems', JSON.stringify(defaultItems));

  items.forEach((item) => {
    if (item.image instanceof File) {
      formData.append('files', item.image);
    }
  });

  return formData;
};

const toDefaultItemFormData = (item: DefaultItemInput) => {
  const formData = new FormData();
  formData.append('name', item.name);
  formData.append('description', item.description);
  formData.append('categoryId', String(item.categoryId));
  formData.append('isAvailable', String(item.availability ?? true));

  if (item.image instanceof File) {
    formData.append('file', item.image);
  }

  return formData;
};

export const defaultItemApi = createApi({
  reducerPath: 'defaultItemApi',
  baseQuery,
  tagTypes: ['defaultItems'],
  endpoints: (builder) => ({
    getDefaultItems: builder.query<any, void>({
      query: () => ({
        url: 'api/defaultItems/bulk',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['defaultItems'],
    }),
    getDefaultItemById: builder.query<any, string | number>({
      query: (id) => ({
        url: `api/defaultItems/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, id) => [{ type: 'defaultItems', id: String(id) }],
    }),
    createDefaultItemsBulk: builder.mutation<any, DefaultItemInput[]>({
      query: (items) => ({
        url: 'api/defaultItems/bulk',
        method: 'POST',
        body: toDefaultItemsBulkFormData(items),
      }),
      invalidatesTags: ['defaultItems'],
    }),
    updateDefaultItem: builder.mutation<any, { id: string | number; body: DefaultItemInput }>({
      query: ({ id, body }) => ({
        url: `api/defaultItems/${id}`,
        method: 'PUT',
        body: toDefaultItemFormData(body),
      }),
      invalidatesTags: (_result, _error, arg) => ['defaultItems', { type: 'defaultItems', id: String(arg.id) }],
    }),
    toggleDefaultItem: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `api/defaultItems/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => ['defaultItems', { type: 'defaultItems', id: String(id) }],
    }),
  }),
});

export const {
  useGetDefaultItemsQuery,
  useGetDefaultItemByIdQuery,
  useCreateDefaultItemsBulkMutation,
  useUpdateDefaultItemMutation,
  useToggleDefaultItemMutation,
} = defaultItemApi;
