import {useGetRestaurantOwnerQuery, useGetUsersHasOrderInRestaurantQuery, useGetUsersQuery} from "@/lib/redux/api";
import {COOKIES} from "@/constant/COOKIES";
import Cookies from "js-cookie";
import {Role} from "@/lib/redux/counterSlice";

export const CheckRole=()=>{
    const isAdmin = Cookies.get(COOKIES.ROLE) === Role.ADMIN;
    const isOwner = Cookies.get(COOKIES.ROLE) === Role.OWNER;
    return {isAdmin,isOwner}
}

export const useUsersByRole = () => {

    const restaurant= useGetRestaurantOwnerQuery({},{skip:!CheckRole().isOwner});
    const restaurantId = restaurant?.currentData?.id;
    const query = CheckRole().isAdmin
        ? useGetUsersQuery(undefined)
        : useGetUsersHasOrderInRestaurantQuery(
            { restaurantId: restaurantId ?? "" },
            { skip: !restaurantId || CheckRole().isAdmin }
        );

    return { ...query, isAdmin:CheckRole().isAdmin };
};


