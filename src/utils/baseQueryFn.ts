import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001/',
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            headers.set('Authorization', accessToken);
        }
        return headers
    },
});
