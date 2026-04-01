import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../utils/baseQueryFn';

export const customerApi = createApi({
    reducerPath: 'customerApi',
    baseQuery,
    tagTypes: ['customers'],
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: ({ page, size, search, status }) => {

                const queryParams = new URLSearchParams({
                    page,
                    size,
                });

                if (search) {
                    queryParams.append('searchTerm', search);
                }
                
                if (status) {
                    if (status === 'all') {
                        // For 'all', don't add any status filter
                    } else {
                        queryParams.append('status', status);
                    }
                }

                const apiUrl = `customers?${queryParams.toString()}`;

                return {
                    url: apiUrl,
                    method: "GET",
                };
            },
            transformResponse: (response) => response,
            providesTags: ["customers"],
        }),
        statusOverview: builder.query<any, void>({
            query: () => {
                return {
                    url: `customers/overview`,
                    method: "GET",
                };
            },
            providesTags: ["customers"],
        }),
        customerDetails: builder.query<any, {id: string}>({
            query: ({id}) => {
                const apiUrl = `customers/${id}/customer-details`;

                return {
                    url: apiUrl,
                    method: "GET",
                };
            },
            transformResponse: (response) => response,
            providesTags: ["customers"],
        }),
        createCustomer: builder.mutation({
            query: (body) => ({
                url: `customers/create-customer`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['customers'],
        }),
        toggeleReferralEligiblity: builder.mutation<any, {id: string; value: boolean}>({
            query: ({id, value}) => ({
                url: `customers/${id}/referral-eligibility`,
                method: 'PUT',
                body: {
                    isReferralEligibleAllTransaction: value
                }
            }),
            invalidatesTags: ['customers'],
        })
    }),
});

export const {
    useGetCustomersQuery,
    useCreateCustomerMutation,
    useCustomerDetailsQuery,
    useStatusOverviewQuery,
    useToggeleReferralEligiblityMutation
} = customerApi;
