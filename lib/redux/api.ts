import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    addressFormData, CategoryResponse,
    IDashboard,
    IPagination,
    IProfile,
    RestaurantResponse,
} from "@/lib/redux/type";


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
    tagTypes:['address','favorite','user',"category","restaurant"],
    endpoints: (builder) => ({
        /** ========================================== Restaurants */
        getRestaurants: builder.query<IPagination<RestaurantResponse>, void>({
            query: () => 'restaurants', // This will call /api/restaurants
        }),
        favUnFav: builder.mutation<IPagination<RestaurantResponse>, {restaurantId:number}>({
            query: ({restaurantId}) => ({
                url:  `restaurants/${restaurantId}/favorites`,
                method: "PUT",
              }),
            invalidatesTags: ['favorite'],
        }),
        getRestaurantOwner: builder.query<RestaurantResponse,void>({
            query: () => ({
                url: `restaurants/owner`,
                method: "GET"
            }),
            providesTags: ['restaurant'],

        }),
        /** ========================================== Dashboard */
        dashboard: builder.query<IDashboard, void>({
            query: () => ({
                url: '/dashboard',
                method: "GET"
              }),
        }),
        /**  ==========================================  User */
        getUsers: builder.query<IPagination<IProfile>,void>({
            query: () => ({
                url: `users`,
                method: "GET"
            }),
            providesTags: ['user'],

        }),
        getUsersHasOrderInRestaurant: builder.query<IPagination<IProfile>,{restaurantId:number|string}>({
            query: ({restaurantId}) => ({
                url: `users/${restaurantId}/orders`,
                method: "GET"
            }),
            providesTags: ['user'],

        }),
        profile: builder.query<IProfile, void>({
            query: () => ({
                url: 'users/profile',
                method: "GET",
              }),
            providesTags: ['address','favorite'],
              
        }),
        /**  ==========================================  Address */
        addAddress: builder.mutation<IProfile,FormData>({
            query: (formData) => ({
                url: `address`,
                method: "POST",
                body: formData,
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
        updateAddress: builder.mutation<IProfile, {addressId:number,body:FormData}>({
            query: ({addressId,body}) => ({
                url: `address/${addressId}`,
                method: "PUT",
                body
              }),
             invalidatesTags: ['address'],
              
        }),
        /**  ==========================================  Category */
        getCategories: builder.query<IPagination<CategoryResponse>,void>({
            query: () => ({
                url: `categories`,
                method: "GET"
            }),
            providesTags: ['category'],

        }),


    }),
});

/** Export hooks for usage in components  */
export const { 
    useGetRestaurantsQuery,
    useDashboardQuery,
    useProfileQuery,
    useDeleteAddressMutation,
    useUpdateAddressMutation,
    useFavUnFavMutation,
    useGetUsersQuery,
    useAddAddressMutation,
    useGetCategoriesQuery,
    useGetRestaurantOwnerQuery,
    useGetUsersHasOrderInRestaurantQuery
 } = apiSlice;