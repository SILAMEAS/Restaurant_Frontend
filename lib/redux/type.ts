import { z } from "zod";

export interface RestauratsReponse {
    contents:   Content[];
    page:       number;
    pageSize:   number;
    totalPages: number;
    total:      number;
    hasNext:    boolean;
}

export interface Content {
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
  
export type LoginFormData = z.infer<typeof loginSchema>;