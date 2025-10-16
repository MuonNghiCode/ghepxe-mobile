export interface ResponseModel<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface ErrorResponseModel {
    success: false;
    message: string;
    error?: string;
}

export interface SuccessResponseModel<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    type: string;
    status: number;
    detail: string;
    errors: any;
}

// Interface chung cho tất cả API response từ backend
export interface ApiResponse<T> {
    value: T;
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export interface ListResponseData<T> {
    items: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    stats?: any;
}

export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        userId: string;
        name: string;
        email: string;
        roles: string[];
    }
}

export interface RegisterResponseData {
    message?: string;
}

export interface ProfileResponseData {
    userId: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    createdDate: string;
    modifiedDate: string;
    roles: string[];
    shipRequestsCount: number;
}

export interface LogoutResponseData {
    message: string;
}

export interface CreateShipRequestResponseData {
    shipRequestId: string;
}

export interface ShipRequestItemData {
    itemId: string;
    name: string;
    amount: number;
    weight: number;
    description: string | null;
    imageLink: string | null;
    size: string;
    type: string;
}

export interface ShipRequestResponseData {
    shipRequestId: string;
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
    items: ShipRequestItemData[];
}

// Type aliases sử dụng ApiResponse chung
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type LogoutResponse = ApiResponse<LogoutResponseData>;
export type CreateShipRequestResponse = ApiResponse<CreateShipRequestResponseData>;
export type GetShipRequestsResponse = ApiResponse<ShipRequestResponseData[]>;
export type GetShipRequestResponse = ApiResponse<ShipRequestResponseData>;
export type BaseResponse = ResponseModel<null>;

