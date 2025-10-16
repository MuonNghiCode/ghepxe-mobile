import { CreateShipRequestRequest, CreateShipRequestResponse, CreateShipRequestResponseData } from 'src/types';
import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from 'src/constants';

class ShipRequestService extends BaseApiService {
    async createShip(data: CreateShipRequestRequest): Promise<CreateShipRequestResponse> {
        return this.post<CreateShipRequestResponseData>(API_ENDPOINTS.SHIP_REQUEST.CREATE, data);
    }
}

export const shipRequestService = new ShipRequestService();