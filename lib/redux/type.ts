import { z } from "zod";
import {FoodType} from "@/constant/FoodType";

export interface IDashboard{
    total_users:number;
    total_orders:number;
    total_categories:number
    total_foods:number
    total_restaurants:number

}
export interface IProfile {
    id:         number;
    profile?:    string;
    profileImage?: string;
    fullName:   string;
    email:      string;
    role:       string;
    bio?:       string;
    createdAt : string;
    updatedAt : string;
    orders:number;
}
export interface IFavorite {
    id:           number;
    name:         string;
    description:  string;
    userId:       number;
    restaurantId: number;
    images:Array<ImageUrl>;
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


export enum enumStatus{
    PENDING="PENDING",
    CONFIRMED='CONFIRMED',
    DELIVERED='DELIVERED',
    CANCELLED='CANCELLED'
}
export interface OrderResponse {
    id: number;
    user : IProfile,
    restaurant:RestaurantResponse,
    totalAmount:number,
    items:Array<any>,
    status:enumStatus,
    createdAt:string
}

export interface RestaurantResponse {
    id: number
    name: string
    description: string
    cuisineType: string
    open: boolean
    openingHours: string
    registrationDate: string
    address: Address
    contactInformation: ContactInformation
    imageUrls: ImageUrl[]
    rating: number
    ownerName: string
    deliveryFee:number
    discount : number
}
export interface CategoryResponse {
    id: number;
    name: string;
    url : string;
    publicId:string;
    restaurant:string;
    items:number;
}

export interface Discount {
    food:number;
    total:number;
    restaurant:number;
}
export interface FoodResponse {
    id: number;
    name: string;
    description:string;
    price:number;
    priceDiscount:number;
    images : Array<string>;
    restaurantId:number;
    restaurantName:string;
    available:boolean;
    foodType:FoodType;
    category:{
        id:number;
        name:string
    };
    tax:number;
    deliverFee:number;
    open:boolean;
    discount:Discount;
}

export interface ImageUrl {
    url: string;
    publicId: string | null;
}


export interface Address {
    name: string
    id: number
    street: string
    city: string
    country: string
    state: string
    zip: string
    currentUsage: boolean
}

export interface ContactInformation {
    phone: string;
    email: string;
}


/** Define the schema for form validation using Zod   */
export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(3, "Password must be at least 3 characters long"),
  });

export const addressSchema = z.object({
    street: z.string().min(3,"Street must be at least 3 characters long"),
    country: z.string().min(3, "Country must be at least 3 characters long"),
    zip: z.string().min(3, "Zip must be at least 3 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long"),
    state: z.string().min(3, "State must be at least 3 characters long"),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    currentUsage: z.boolean(),
});

export const categorySchema = z.object({
    name: z.string().min(3, "Password must be at least 3 characters long"),
});

export const foodSchema = z.object({
    name: z.string(),
    description: z.string().min(3, "description must be at least 3 characters long"),
    price: z.string(),
    discount: z.string(),
    discount_food: z.string(),
    discount_restaurant: z.string(),
    price_with_discount: z.string().optional(),
    restaurantId: z.string(),
    foodType: z.string(),
    categoryId:z.string(),
    available:z.boolean()
});

const AddressSchema = z.object({
    zip:z.string().min(1,"Zip is required"),
    name:z.string().min(1, "Name is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    currentUsage:z.boolean()
});

const ContactInformationSchema = z.object({
    phone: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email address"),
});
export const restaurantSchema = z.object({
    ownerName: z.string().min(1, "Owner name is required"),
    name: z.string().min(1, "Restaurant name is required"),
    description: z.string().min(10, "Description should be at least 10 characters"),
    cuisineType: z.string().min(1, "Cuisine type is required"),
    address: AddressSchema,
    contactInformation: ContactInformationSchema,
    openingHours: z.string().min(1, "Opening hours are required"),
    open: z.boolean(),
    deliveryFee:z.number(),
    discount:z.number()
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type addressFormData = z.infer<typeof addressSchema>;
export type categoryFormData = z.infer<typeof categorySchema>;
export type foodFormData = z.infer<typeof foodSchema>;

export type RestaurantFormData = z.infer<typeof restaurantSchema>;


/** Pagination  */
export interface PaginationRequest{

    search?:string;
    filterBy?:string;

    pageSize:number;
    sortBy:string;
    pageNo:number;
    sortOrder:SORT;

    price?:number;
    minPrice?:number;  // new field
    maxPrice?:number;  // new field

    foodType?:string;
}

export const PaginationRequestDefault:PaginationRequest={
    pageSize :10,
    sortBy:"id",
    pageNo:1,
    sortOrder:'desc'
}
export type SORT='asc'|'desc';

export interface PaginationRequestWithIngoreCase {
    params?: PaginationRequest;
    caseIgnoreFilter?: boolean;
    restaurantId?: number;
}

export interface Item {
    id: number
    quantity: number
    food: FoodResponse
}
export interface CartResponse {
    restaurantName:string;
    totalItems:number;
    id: number;
    items: Item[]
}
