// features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {LoginFormData, RestauratsReponse} from "@/lib/redux/type";

interface Restaurant {
    id: number;
    name: string;
    // Add other fields as needed
}
interface IDashboard{
    total_users:number;
    total_orders:number;
    total_categories:number

}
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl:process.env.NEXT_PUBLIC_BASE_URL+ '/api/' }), // Adjust baseUrl to your API
    endpoints: (builder) => ({
        getRestaurants: builder.query<RestauratsReponse, unknown>({
            query: () => 'restaurants', // This will call /api/restaurants
        }),
        dashboard: builder.query<IDashboard, unknown>({
            query: () => ({
                url: '/dashboard',
                method: "GET"
              }),
        }),
    }),
});

// Export hooks for usage in components
export const { useGetRestaurantsQuery,useDashboardQuery } = apiSlice;