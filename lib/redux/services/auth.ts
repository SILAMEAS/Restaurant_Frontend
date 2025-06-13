// features/api/apiSlice.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {LoginFormData} from "@/lib/redux/services/type";
import {UserInfo} from '../counterSlice';

interface Restaurant {
    id: number;
    name: string;
    // Add other fields as needed
}

export const authSlice = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl:process.env.NEXT_PUBLIC_BASE_URL }), // Adjust baseUrl to your API
    endpoints: (builder) => ({
        login: builder.mutation<UserInfo, LoginFormData>({
            query: (body) => ({
                url: '/sign-in',
                method: "Post",
                body,
              }),
        }),
    }),
});

// Export hooks for usage in components
export const { useLoginMutation } = authSlice;