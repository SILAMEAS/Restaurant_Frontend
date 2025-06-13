import {RestaurantResponse} from "@/lib/redux/services/type";

export const mockRestaurant: RestaurantResponse = {
    ownerId:NaN,
    ownerName: "",
    rating: NaN,
    registrationDate: "",
    id: NaN,
    name: "",
    description:
        "",
    cuisineType: "",
    address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        currentUsage: false,
        name: "",
        id: NaN,
    },
    contactInformation: {
        phone: "",
        email: "",
    },
    openingHours: "",
    imageUrls: [
        {
            url: "",
            publicId: "",
        },
        {
            url: "",
            publicId: "",
        },
    ],
    open: false,
    deliveryFee:NaN,
    discount:NaN
}
