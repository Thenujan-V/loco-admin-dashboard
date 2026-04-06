import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from 'src/utils/baseQueryFn';

export type CategoryItemRecord = {
  id: number | string;
  name: string;
  description: string;
  image: string;
  availability: boolean;
};

export type CategoryItemInput = {
  name: string;
  description: string;
  image: File | string | null;
  availability?: boolean;
};

export const normalizeCategoryItemsResponse = (data: any): CategoryItemRecord[] => {
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
    image: item.image || item.imageUrl || item.fileUrl || item.url || '',
    availability:
      item.isAvailable === null || item.isAvailable === undefined
        ? true
        : Boolean(item.isAvailable),
  }));
};

const toCategoryItemsFormData = (items: CategoryItemInput[]) => {
  const formData = new FormData();
  const categoryItems = items.map((item) => ({
    name: item.name,
    description: item.description,
    isAvailable: item.availability ?? true,
  }));

  formData.append('itemCategories', JSON.stringify(categoryItems));

  items.forEach((item) => {
    if (item.image instanceof File) {
      formData.append('files', item.image);
    }
  });

  return formData;
};

export const categoryItemApi = createApi({
  reducerPath: 'categoryItemApi',
  baseQuery,
  tagTypes: ['categoryItems'],
  endpoints: (builder) => ({
    getCategoryItems: builder.query<any, void>({
      query: () => ({
        url: 'api/categoryItems',
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: ['categoryItems'],
    }),
    getCategoryItemById: builder.query<any, string | number>({
      query: (id) => ({
        url: `api/categoryItems/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, id) => [{ type: 'categoryItems', id: String(id) }],
    }),
    createCategoryItems: builder.mutation<any, CategoryItemInput[]>({
      query: (items) => ({
        url: 'api/categoryItems',
        method: 'POST',
        body: toCategoryItemsFormData(items),
      }),
      invalidatesTags: ['categoryItems'],
    }),
    deleteCategoryItem: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `api/categoryItem/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => ['categoryItems', { type: 'categoryItems', id: String(id) }],
    }),
  }),
});

export const {
  useGetCategoryItemsQuery,
  useGetCategoryItemByIdQuery,
  useCreateCategoryItemsMutation,
  useDeleteCategoryItemMutation,
} = categoryItemApi;
