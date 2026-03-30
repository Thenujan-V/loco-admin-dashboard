import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
        headers.set('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
        return headers
    },
});