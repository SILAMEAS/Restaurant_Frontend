import {
    useGetRestaurantOwnerQuery,
    useGetUsersHasOrderInRestaurantQuery,
    useGetUsersQuery
} from "@/lib/redux/services/api";
import {COOKIES} from "@/constant/COOKIES";
import Cookies from "js-cookie";
import {Role, setRestaurant} from "@/lib/redux/counterSlice";
import {useEffect} from "react";
import {useAppDispatch} from "@/lib/redux/hooks";

export const CheckRole = () => {
    const isAdmin = Cookies.get(COOKIES.ROLE) === Role.ADMIN;
    const isOwner = Cookies.get(COOKIES.ROLE) === Role.OWNER;
    return {isAdmin, isOwner}
}

export const useUsersByRole = (params: { offset?: number; limit?: number; search?: string } = {}) => {
    const restaurant = useGetRestaurantOwnerQuery({}, {skip: !CheckRole().isOwner});
    const restaurantId = restaurant?.currentData?.id;
    const dispatch = useAppDispatch();
    const query = CheckRole().isAdmin
        ? useGetUsersQuery(params)
        : useGetUsersHasOrderInRestaurantQuery(
            {restaurantId: restaurantId ?? ""},
            {skip: !restaurantId || CheckRole().isAdmin}
        );
    useEffect(() => {
        if (restaurant.currentData) {
            dispatch(setRestaurant(restaurant.currentData));
        }


    }, [{...restaurant}])

    return {...query, isAdmin: CheckRole().isAdmin};
};


