// features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {LoginFormData, RestauratsReponse} from "@/lib/redux/type";
import { store } from './store';
import { setProfile } from './counterSlice';

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
export interface IProfile {
    id:         number;
    profile?:    string;
    fullName:   string;
    email:      string;
    role:       string;
    addresses:  Array<IAddress>;
    favourites: Array<IFavorite>;
}
export interface IFavorite {
    id:           number;
    name:         string;
    description:  string;
    userId:       number;
    restaurantId: number;
}
export interface IAddress {
    id:            number;
    streetAddress: string;
    city:          string;
    country:       string;
    stateProvince: string;
    postalCode:    string;
    name : string;
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
    endpoints: (builder) => ({
        getRestaurants: builder.query<RestauratsReponse, void>({
            query: () => 'restaurants', // This will call /api/restaurants
        }),
        dashboard: builder.query<IDashboard, void>({
            query: () => ({
                url: '/dashboard',
                method: "GET"
              }),
        }),
        profile: builder.query<IProfile, Object>({
            query: () => ({
                url: 'users/profile',
                method: "GET",
                  responseHandler:async(res)=>{
                                    const data=await res.json();
                                    store.dispatch(setProfile(data))
                                }
              }),
              
        }),
    }),
});

// Export hooks for usage in components
export const { useGetRestaurantsQuery,useDashboardQuery,useProfileQuery } = apiSlice;