import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from "src/constants";
import { ApiResponse, CreateRouteRequestRequest, CreateRouteRequestResponse, CreateRouteRequestResponseData, GetRouteRequestResponse, RouteRequestResponseData } from "src/types";
import { AssignShipRequestToRouteRequest } from "src/types/request";
import { AssignShipRequestResponse } from "src/types/responses";

class RouteRequestService extends BaseApiService {
    async createRoute(data: CreateRouteRequestRequest): Promise<CreateRouteRequestResponse>{
        return this.post<CreateRouteRequestResponseData>(API_ENDPOINTS.ROUTE_REQUEST.CREATE, data);
    }
    async getAllRouteRequests(): Promise<ApiResponse<RouteRequestResponseData[]>> {
        return this.get<RouteRequestResponseData[]>(API_ENDPOINTS.ROUTE_REQUEST.GET_ALL);
    }

    async assignShipRequestToRoute(routeRequestId: string, data: AssignShipRequestToRouteRequest): Promise<AssignShipRequestResponse> {
        return this.post<AssignShipRequestResponse>(API_ENDPOINTS.ROUTE_REQUEST.ASSIGN.replace("{routeRequestId}", routeRequestId), data);
    }
}

export const routeRequestService = new RouteRequestService();