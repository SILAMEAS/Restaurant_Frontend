import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {
    CartResponse,
    CategoryResponse,
    FoodResponse,
    IAddress,
    IDashboard, IFavorite,
    IPagination,
    IProfile, OrderResponse, PaginationRequest, PaginationRequestDefault, PaginationRequestWithIngoreCase,
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
    tagTypes:['address','favorite','user',"category","restaurant",'order','cart'],
    endpoints: (builder) => ({
        /** ========================================== Restaurants */
        getRestaurants: builder.query<IPagination<RestaurantResponse>, { offset?: number; limit?: number; search?: string }>({
            query: (params) => ({
                url: 'restaurants',
                method: 'GET',
                params
            }),
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
        getUsers: builder.query<IPagination<IProfile>, { offset?: number; limit?: number; search?: string }>({
            query: (params) => ({
                url: `users`,
                method: "GET",
                params,
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
        addCategory: builder.mutation<IPagination<CategoryResponse>, FormData>({
            query: (body) => ({
                url: `categories`,
                method: "POST",
                body
            }),
            invalidatesTags: ['category'],

        }),
        updateCategory: builder.mutation<IPagination<CategoryResponse>, { body:FormData,categoryId:string|number }>({
            query: ({body,categoryId}) => ({
                url: `categories/${categoryId}`,
                method: "PUT",
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
        getFoods: builder.query<IPagination<FoodResponse>,PaginationRequestWithIngoreCase>({
            query: ({params=PaginationRequestDefault,caseIgnoreFilter}) => ({
                url: `foods`,
                method: "GET",
                params:{...params,filterBy:caseIgnoreFilter?undefined:params.filterBy,foodType:params.foodType===null?undefined:params.foodType}
            }),
            providesTags: ['category'],

        }),
        getFoodsByRestaurantId: builder.query<IPagination<FoodResponse>, {params?: PaginationRequest, restaurantId: number}>({
            query: ({params=PaginationRequestDefault, restaurantId}) => ({
                url: `foods/restaurant/${restaurantId}`,
                method: "GET",
                params: params
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

        /**  ==========================================  Cart Item */
        removeCart: builder.mutation<String,{cartId:string|number}>({
            query: ({cartId}) => ({
                url: `carts/${cartId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['cart'],

        }),
        removeItemFromCart: builder.mutation<String,{cartId:string|number,cartItemId:string|number}>({
            query: ({cartItemId,cartId}) => ({
                url: `carts/${cartId}/cartItems/${cartItemId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['cart'],

        }),
        updateCartItemInCart: builder.mutation<String,{cartId:string|number,cartItemId:string|number,quantity:string|number}>({
            query: ({cartId,cartItemId,quantity}) => ({
                url: `carts/${cartId}/cartItems/${cartItemId}`,
                method: "PUT",
                params:{quantity}
            }),
            invalidatesTags: ['cart'],

        }),
        /**  ==========================================  Cart */
        addCart: builder.mutation<String,{foodId:string |number,quantity:string|number}>({
            query: (params) => ({
                url: `carts`,
                method: "POST",
                params
            }),
            invalidatesTags: ['cart'],

        }),
        getCart: builder.query<Array<CartResponse>,void>({
            query: () => ({
                url: `carts`,
                method: "GET",
            }),
            providesTags:['cart']

        }),
        /**  ==========================================  Order */
        getOrders: builder.query<IPagination<OrderResponse>,void>({
            query: () => ({
                url: `orders`,
                method: "GET"
            }),
            providesTags: ['order'],

        }),
        addOrder: builder.mutation<IPagination<OrderResponse>,{cartId:number}>({
            query: ({cartId}) => ({
                url: `orders/cart/${cartId}`,
                method: "POST"
            }),
            invalidatesTags: ['order','cart'],

        }),
        deleteOrder: builder.mutation<IPagination<OrderResponse>,{orderId:string|number}>({
            query: ({orderId}) => ({
                url: `orders/${orderId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['order'],

        }),
        getRestaurantById: builder.query<RestaurantResponse, number>({
            query: (id) => `/restaurants/${id}`,
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
    useUpdateRestaurantMutation,
    useDeleteOrderMutation,
    useUpdateCategoryMutation,
    useAddCartMutation,
    useGetCartQuery,
    useRemoveItemFromCartMutation,
    useUpdateCartItemInCartMutation,
    useRemoveCartMutation,
    useGetRestaurantByIdQuery,
    useGetFoodsByRestaurantIdQuery,
    useAddOrderMutation
 } = apiSlice;