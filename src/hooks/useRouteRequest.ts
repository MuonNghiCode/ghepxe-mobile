import { useState } from "react";
import {
  CreateRouteRequestRequest,
  CreateRouteRequestResponse,
  RouteRequestResponseData,
  ApiResponse,
} from "src/types";
import { routeRequestService } from "src/service/routeRequestService";

export function useRouteRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeRequests, setRouteRequests] = useState<RouteRequestResponseData[]>([]);
  const [createResult, setCreateResult] = useState<CreateRouteRequestResponse | null>(null);

  // Tạo route request mới
  const createRouteRequest = async (data: CreateRouteRequestRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await routeRequestService.createRoute(data);
      setCreateResult(response);
      return response;
    } catch (err: any) {
      setError(err?.message || "Tạo route request thất bại");
      setCreateResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả route requests
  const getAllRouteRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await routeRequestService.getAllRouteRequests();
      setRouteRequests(response?.value || []);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách route request thất bại");
      setRouteRequests([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    routeRequests,
    createResult,
    createRouteRequest,
    getAllRouteRequests,
  };
}