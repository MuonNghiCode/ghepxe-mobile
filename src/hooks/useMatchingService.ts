import { useState } from "react";
import { matchingService } from "src/service/matchingService";
import { DriverMatchingRequest, DriverMatchingShipResponseData, MatchingDriverResponse,  } from "src/types";

export function useMatchingService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedRequests, setMatchedRequests] = useState<DriverMatchingShipResponseData[]>([]);

  const getShipRequestMatching = async (request: DriverMatchingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: MatchingDriverResponse = await matchingService.getShipRequestMatching(request);
      setMatchedRequests(response.value || []);
      return response;
    } catch (err: any) {
      setError(err?.message || "Không thể lấy dữ liệu ghép đơn");
      setMatchedRequests([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    matchedRequests,
    getShipRequestMatching,
  };
}