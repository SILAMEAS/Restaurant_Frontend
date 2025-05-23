import { z } from "zod";

export interface RestauratsReponse {
    contents:   ContentRestaurant[];
    page:       number;
    pageSize:   number;
    totalPages: number;
    total:      number;
    hasNext:    boolean;
}

export interface ContentRestaurant {
    id:                 number;
    name:               string;
    description:        string;
    cuisineType:        string;
    open:               boolean;
    openingHours:       string;
    registrationDate:   Date;
    address:            Address;
    contactInformation: ContactInformation;
    imageUrls:          string[];
    rating :             number;
}

export interface Address {
    streetAddress: string;
    city:          string;
    country:       string;
    stateProvince: string;
    postalCode:    string;
}

export interface ContactInformation {
    phone: string;
    email: string;
}

// Define the schema for form validation using Zod
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