
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
    imageUrls:          null;
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