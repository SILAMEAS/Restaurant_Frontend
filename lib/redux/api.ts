// features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {RestauratsReponse} from "@/lib/redux/type";

interface Restaurant {
    id: number;
    name: string;
    // Add other fields as needed
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl:process.env.NEXT_PUBLIC_BASE_URL+ '/api/' }), // Adjust baseUrl to your API
    endpoints: (builder) => ({
        getRestaurants: builder.query<RestauratsReponse, unknown>({
            query: () => 'restaurants', // This will call /api/restaurants
        }),
    }),
});

// Export hooks for usage in components
export const { useGetRestaurantsQuery } = apiSlice;