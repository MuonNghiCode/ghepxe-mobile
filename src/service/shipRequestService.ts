import { 
    CreateShipRequestRequest, 
    CreateShipRequestResponse,
    GetShipRequestsResponse,
    GetShipRequestResponse,
    ShipRequestResponseData,
    ShipRequestDetailResponseData,
    GetShipRequestDetailResponse
} from 'src/types';
import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from 'src/constants';

class ShipRequestService extends BaseApiService {
    async createShip(data: CreateShipRequestRequest): Promise<CreateShipRequestResponse> {
        return this.post<string>(API_ENDPOINTS.SHIP_REQUEST.CREATE, data);
    }

    async getAllShipRequests(userId: string): Promise<GetShipRequestsResponse> {
        const endpoint = API_ENDPOINTS.SHIP_REQUEST.GET_BY_USER.replace('{userId}', userId);
        return this.get<ShipRequestResponseData[]>(endpoint);
    }

    async getShipRequestById(shipRequestId: string): Promise<GetShipRequestResponse> {
        return this.get<ShipRequestResponseData>(`${API_ENDPOINTS.SHIP_REQUEST.GET_ALL}/${shipRequestId}`);
    }

    async updateShipRequest(shipRequestId: string, data: Partial<CreateShipRequestRequest>): Promise<GetShipRequestResponse> {
        return this.put<ShipRequestResponseData>(`${API_ENDPOINTS.SHIP_REQUEST.UPDATE}/${shipRequestId}`, data);
    }

    async deleteShipRequest(shipRequestId: string): Promise<any> {
        return this.delete(`${API_ENDPOINTS.SHIP_REQUEST.DELETE}/${shipRequestId}`);
    }

    async getShipRequestDetail(shipRequestId: string): Promise<GetShipRequestDetailResponse> {
        const endpoint = API_ENDPOINTS.SHIP_REQUEST.GET_DETAILS.replace('{shipRequestId}', shipRequestId);
        return this.get<ShipRequestDetailResponseData[]>(endpoint);
    }

    async addShipRequestItem(shipRequestId: string, itemData: any): Promise<any> {
        const endpoint = API_ENDPOINTS.SHIP_REQUEST.ADD_ITEM.replace('{shipRequestId}', shipRequestId);
        return this.post(endpoint, itemData);
    }

    async updateShipRequestItem(itemId: string, itemData: any): Promise<any> {
        const endpoint = API_ENDPOINTS.SHIP_REQUEST.UPDATE_ITEM.replace('{itemId}', itemId);
        return this.put(endpoint, itemData);
    }

    async deleteShipRequestItem(itemId: string): Promise<any> {
        const endpoint = API_ENDPOINTS.SHIP_REQUEST.DELETE_ITEM.replace('{itemId}', itemId);
        return this.delete(endpoint);
    }

    async checkHealth(): Promise<any> {
        return this.get(API_ENDPOINTS.SHIP_REQUEST.HEALTH);
    }
}

export const shipRequestService = new ShipRequestService();