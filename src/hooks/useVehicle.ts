import { useState } from "react";
import {  CreateVehicleResponse, GetVehicleResponseData } from "src/types/responses";
import { vehicleService } from "src/service/vehicleService";
import { CreateVehicleRequest } from "src/types";

export function useVehicle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<GetVehicleResponseData[]>([]);
  const [createResult, setCreateResult] = useState<CreateVehicleResponse | null>(null);

  // Tạo xe mới
  const createVehicle = async (data: CreateVehicleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleService.createVehicle(data);
      setCreateResult(response);
      return response;
    } catch (err: any) {
      setError(err?.message || "Tạo xe thất bại");
      setCreateResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Lấy tất cả xe
  const getAllVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vehicleService.getAllVehicles();
      setVehicles(response?.value || []);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách xe thất bại");
      setVehicles([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    vehicles,
    createResult,
    createVehicle,
    getAllVehicles,
  };
}