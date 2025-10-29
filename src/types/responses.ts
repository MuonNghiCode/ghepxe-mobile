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
    imageFileId: string | null;
    imageUrl: string | null; // Thêm imageUrl
    size: string;
}

export interface ShipRequestResponseData {
    shipRequestId: string;
    userId: string;
    driverId: string | null; // Thêm thông tin driver
    driverName: string | null;
    driverAvatarUrl: string | null;
    driverRating: number | null;
    driverPhone: string | null;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    pickupWindowStart: string;
    pickupWindowEnd: string;
    items: ShipRequestItemData[];
    shipType: string;
    itemCategory: string;
    itemType: string;
    specialRequest?: {
        returnDelivery: boolean;
        loading: boolean;
        driverAssistance: boolean;
        smsNotification: boolean;
        electronicInvoice: boolean;
    };
    routePolyline: string | null; // Thêm routePolyline
    status: string;
}

export interface ShipRequestDetailResponseData {
    itemId: string;
    name: string;
    amount: number;
    weight: number;
    description: string | null;
    imageFileId: string | null;
    imageUrl: string | null;
    size: string;
}

export interface UploadFileResponseData {
  fileId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export interface GetFileResponseData {
  presignedUrl: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  expiresAt: string;
  downloadMethod: string;
  fileExtension: string;
}

// Type aliases
export type UploadFileResponse = ApiResponse<UploadFileResponseData>;
export type CreateShipRequestResponse = ApiResponse<string>;
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type ProfileResponse = ApiResponse<ProfileResponseData>;
export type LogoutResponse = ApiResponse<LogoutResponseData>;
export type GetShipRequestsResponse = ApiResponse<ShipRequestResponseData[]>;
export type GetShipRequestResponse = ApiResponse<ShipRequestResponseData>;
export type GetShipRequestDetailResponse = ApiResponse<ShipRequestDetailResponseData[]>;
export type BaseResponse = ResponseModel<null>;
export type GetFileResponse = ApiResponse<GetFileResponseData>;

