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

export interface CreateShipItemRequest {
    name: string;
    amount: number;
    weight: number;
    description?: string;
    imageFileId?: string;
    size: string;
}

export interface SpecialRequestData {
    returnDelivery: boolean;
    loading: boolean;
    driverAssistance: boolean;
    smsNotification: boolean;
    electronicInvoice: boolean;
}

export interface CreateShipRequestRequest {
    userId: string;
    
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    
    dropoffAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    
    pickupWindowStart: string;
    pickupWindowEnd: string;
    
    items: CreateShipItemRequest[];
    itemType: string; // Loại sản phẩm: "Thời trang", "Điện tử", v.v.
    status?: string;
    shipType?: string;
    itemCategory: string; // Loại hàng hóa: "Business" hoặc "Personal"
    specialRequest?: SpecialRequestData;
}

export interface CreateRouteRequestRequest {
  driverId: string;
  vehicleId: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  departureTime: string;
  estimatedArrivalTime: string;
  isFullLoad: boolean;
  availableWeight: number;
  availableVolume: number;
  supportedCommodities: string;
  cargoHandlingNotes: string;
  temperatureControlled: boolean;
  minTemperatureCelsius: number;
  maxTemperatureCelsius: number;
  estimatedRouteCost: number;
  estimatedFuelCost: number;
  additionalNotes: string;
  routePolyline: string;
  status: string;
}

export interface UploadFileRequest {
    file: {
        uri: string;      // Đường dẫn file local
        name: string;     // Tên file
        type: string;     // Loại file, ví dụ: "image/png"
    };
}

export interface GetFileRequest {
  fileId: string;
  expirationMinutes?: number; // mặc định 2880 nếu không truyền
}

export interface CreateVehicleRequest {
    driverId: string,
    licensePlate: string,
    brand: string,
    model: string,
    year: number,
    color: string,
    vehicleType: string,
    maxWeight: number,
    maxVolume: number,
    maxSeats: number,
}

export interface DriverMatchingRequest {
    routeRequestId: string;
}

export interface AssignShipRequestToRouteRequest {
  shipRequestId: string;
}