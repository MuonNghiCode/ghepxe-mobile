export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;  
    email: string;
    password: string;
}

export interface LogoutRequest {
    refreshToken: string;
}

export interface CreateShipRequestRequest {
    userId: string;

    pickupStreet: string;
    pickupWard: string;
    pickupDistrict: string;
    pickupCity: string;
    pickupProvince: string;
    pickupPostalCode: string;
    pickupCountry: string;
    pickupLatitude: number;
    pickupLongitude: number;

    dropoffStreet: string;
    dropoffWard: string;
    dropoffDistrict: string;
    dropoffCity: string;
    dropoffProvince: string;
    dropoffPostalCode: string;
    dropoffCountry: string;
    dropoffLatitude: number;
    dropoffLongitude: number;

    pickupWindowStart: string;
    pickupWindowEnd: string;

    items: CreateShipItemRequest[];
}

export interface CreateShipItemRequest {
    name: string;
    amount: number;
    weight: number;
    description?: string;
    imageLink?: string;
    size?: string;
    type: string;
}
