import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    CategoryResponse,
    FoodResponse,
    IAddress,
    IDashboard, IFavorite,
    IPagination,
    IProfile, OrderResponse,
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
    tagTypes:['address','favorite','user',"category","restaurant",'order'],
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
        getRestaurantOwner: builder.query<RestaurantResponse,{}>({
            query: () => ({
                url: `restaurants/owner`,
                method: "GET"
            }),
            providesTags: ['restaurant'],

        }),
        updateRestaurant: builder.mutation<RestaurantResponse, {restaurantId:number,body:FormData}>({
            query: ({restaurantId,body}) => ({
                url:  `restaurants/${restaurantId}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ['restaurant'],
        }),
        /** ========================================== Dashboard */
        dashboard: builder.query<IDashboard, void>({
            query: () => ({
                url: '/dashboard',
                method: "GET"
              }),
            providesTags:['category','user','order']
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
                url: `users/${restaurantId}/user-orders`,
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
        myAddress: builder.query<Array<IAddress>, void>({
            query: () => ({
                url: 'users/address',
                method: "GET",
            }),
            providesTags: ['address'],

        }),
        myFav: builder.query<Array<IFavorite>, void>({
            query: () => ({
                url: 'users/favorite',
                method: "GET",
            }),
            providesTags: ['favorite'],

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
        addCategory: builder.mutation<IPagination<CategoryResponse>,FormData>({
            query: (body) => ({
                url: `categories`,
                method: "POST",
                body
            }),
            invalidatesTags: ['category'],

        }),
        getCategories: builder.query<IPagination<CategoryResponse>,void>({
            query: () => ({
                url: `categories`,
                method: "GET"
            }),
            providesTags: ['category'],

        }),
        deleteCategories: builder.mutation<IPagination<CategoryResponse>,{categoryId:string|number}>({
            query: ({categoryId}) => ({
                url: `categories/${categoryId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['category'],

        }),
        /**  ==========================================  Food */
        getFoods: builder.query<IPagination<FoodResponse>,void>({
            query: () => ({
                url: `foods`,
                method: "GET"
            }),
            providesTags: ['category'],

        }),
        addFood: builder.mutation<IPagination<FoodResponse>,FormData>({
            query: (body) => ({
                url: `foods`,
                method: "POST",
                body
            }),
            invalidatesTags: ['category'],

        }),
        updateFood: builder.mutation<IPagination<FoodResponse>, {foodId:string|number, body:FormData }>({
            query: ({foodId,body}) => ({
                url: `foods/${foodId}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ['category'],

        }),
        deleteFood: builder.mutation<IPagination<FoodResponse>,{foodId:number|string}>({
            query: ({foodId}) => ({
                url: `foods/${foodId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['category'],

        }),
        /**  ==========================================  Order */
        getOrders: builder.query<IPagination<OrderResponse>,void>({
            query: () => ({
                url: `orders`,
                method: "GET"
            }),
            providesTags: ['order'],

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
    useGetUsersHasOrderInRestaurantQuery,
    useGetFoodsQuery,
    useAddCategoryMutation,
    useMyAddressQuery,
    useMyFavQuery,
    useDeleteCategoriesMutation,
    useAddFoodMutation,
    useDeleteFoodMutation,
    useUpdateFoodMutation,
    useGetOrdersQuery,
    useUpdateRestaurantMutation
 } = apiSlice;