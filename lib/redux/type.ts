import { z } from "zod";


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
    // addresses:  Array<IAddress>;
    // favourites: Array<IFavorite>;
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
}
export interface CategoryResponse {
    id: number;
    name: string;
    url : string;
    publicId:string;
    restaurant:string;
    items:number;
}
export interface FoodResponse {
    id: number;
    name: string;
    description:string;
    price:number;
    images : Array<string>;
    restaurantId:number;
    restaurantName:string;
    available:boolean;
    vegetarian:number;
    seasonal:number;
    category:{
        id:number;
        name:string
    }
}

export interface ImageUrl {
    url: string
    publicId: string
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
export interface PaginationRequest{
    pageSize:number;
    sortBy:string;
    pageNo:number;
    sortOrder:SORT;
}

export const PaginationRequestDefault:PaginationRequest={
    pageSize :10,
    sortBy:"id",
    pageNo:1,
    sortOrder:'desc'
}
export type SORT='asc'|'desc';

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
  
export type LoginFormData = z.infer<typeof loginSchema>;
export type addressFormData = z.infer<typeof addressSchema>;