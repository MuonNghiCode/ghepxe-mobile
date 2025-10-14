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

export interface ActualLoginResponse {
    value: LoginResponseData;
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export interface RegisterResponseData {
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export interface ActualRegisterResponse {
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export interface LogoutResponseData {
    message: string;
}

export type LogoutResponse = LogoutResponseData;
export type RegisterResponse = ActualRegisterResponse;  
export type LoginResponse = ActualLoginResponse;
export type BaseResponse = ResponseModel<null>;

// Thêm type cho error response mới
export interface ApiErrorResponse {
    type: string;
    status: number;
    detail: string;
    errors: any;
}

// Thêm type cho profile response
export interface ProfileData {
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

export interface ActualProfileResponse {
    value: ProfileData;
    isSuccess: boolean;
    isFailure: boolean;
    error: {
        code: string;
        description: string;
    };
}

export type ProfileResponse = ActualProfileResponse;

