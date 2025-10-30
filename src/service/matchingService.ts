import { BaseApiService } from "src/api";
import { API_ENDPOINTS } from "src/constants";
import { DriverMatchingRequest, DriverMatchingShipResponseData, MatchingDriverResponse } from "src/types";

class MatchingService extends BaseApiService {
    async getShipRequestMatching(routerequestId: DriverMatchingRequest): Promise <MatchingDriverResponse> {
        return this.post<DriverMatchingShipResponseData[]>(API_ENDPOINTS.GEMINI.DRIVER_MATCHING, routerequestId);
    }
}

export const matchingService = new MatchingService();