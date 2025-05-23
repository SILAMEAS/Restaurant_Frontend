// features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {addressFormData, LoginFormData, RestauratsReponse} from "@/lib/redux/type";
import { store } from './store';
import { setFavorite, setProfile } from './counterSlice';

interface Restaurant {
    id: number;
    name: string;
    // Add other fields as needed
}
export interface IDashboard{
    total_users:number;
    total_orders:number;
    total_categories:number

}
export interface IProfile {
    id:         number;
    profile?:    string;
    fullName:   string;
    email:      string;
    role:       string;
    addresses:  Array<IAddress>;
    favourites: Array<IFavorite>;
    createdAt : string;
    updatedAt : string;
}
export interface IFavorite {
    id:           number;
    name:         string;
    description:  string;
    userId:       number;
    restaurantId: number;
}
export interface IAddress {
    name:         string;
    id:           number;
    street:       string;
    city:         string;
    country:      string;
    state:        string;
    zip:          string;
    currentUsage: boolean;
}
export interface IPagination<T> {
  contents: T[];
  page: number;
  pageSize?: number;
  totalPages?: number;
  total?: number;
  hasNext?: boolean;
  totalInvalid?: number;
}

export const customBaseQuery = (url: string) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: url,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).counter.login?.accessToken;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });
  
    return rawBaseQuery;
  };

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery(process.env.NEXT_PUBLIC_BASE_URL+ '/api/'), // Adjust baseUrl to your API
    tagTypes:['address','favorite','users'],
    endpoints: (builder) => ({
        /** Restaurants */ 
        getRestaurants: builder.query<RestauratsReponse, void>({
            query: () => 'restaurants', // This will call /api/restaurants
        }),
        favUnFav: builder.mutation<RestauratsReponse,  {restaurantId:number}>({
            query: ({restaurantId}) => ({
                url:  `restaurants/${restaurantId}/favorites`,
                method: "PUT",
              }),
            invalidatesTags: ['favorite'],
        }),
        /** Dashboard */ 
        dashboard: builder.query<IDashboard, void>({
            query: () => ({
                url: '/dashboard',
                method: "GET"
              }),
        }),
        /** Profile */ 
        profile: builder.query<IProfile, void>({
            query: () => ({
                url: 'users/profile',
                method: "GET",
              }),
            providesTags: ['address','favorite'],
              
        }),
        /** Address */
        addAddress: builder.mutation<IProfile,addressFormData>({
            query: (body) => ({
                url: `address`,
                method: "POST",
                body,
                headers:{
                    'Content-Type': 'multipart/form-data',
                }
            }),
            invalidatesTags: ['address'],

        }),
        deleteAddress: builder.mutation<IProfile, {addressId:number}>({
            query: ({addressId}) => ({
                url: `address/${addressId}`,
                method: "DELETE"
              }),
             invalidatesTags: ['address'],
              
        }),
        /** Address */ 
        updateAddress: builder.mutation<IProfile, {addressId:number,body:FormData}>({
            query: ({addressId,body}) => ({
                url: `address/${addressId}`,
                method: "PUT",
                body
              }),
             invalidatesTags: ['address'],
              
        }),
        /** users */ 
        getUsers: builder.query<IPagination<IProfile>,void>({
            query: () => ({
                url: `users`,
                method: "GET"
              }),
             providesTags: ['users'],
              
        }),
    }),
});

// Export hooks for usage in components
export const { 
    useGetRestaurantsQuery,
    useDashboardQuery,
    useProfileQuery,
    useLazyGetRestaurantsQuery,
    useDeleteAddressMutation,
    useUpdateAddressMutation,
    useFavUnFavMutation,
    useGetUsersQuery,
    useAddAddressMutation
 } = apiSlice;