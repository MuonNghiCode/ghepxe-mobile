import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from "src/constants";
import { CreateVehicleRequest } from "src/types";
import { CreateVehicleResponse, CreateVehicleResponseData, GetVehicleResponseData, ApiResponse } from "src/types/responses";

class VehicleService extends BaseApiService {
    async createVehicle(data: CreateVehicleRequest): Promise<CreateVehicleResponse> {
        return this.post<CreateVehicleResponseData>(API_ENDPOINTS.VEHICLE.CREATE_VEHICLE, data);
    }

    async getAllVehicles(): Promise<ApiResponse<GetVehicleResponseData[]>> {
        return this.get<GetVehicleResponseData[]>(API_ENDPOINTS.VEHICLE.GET_ALL_VEHICLES);
    }
}

export const vehicleService = new VehicleService();