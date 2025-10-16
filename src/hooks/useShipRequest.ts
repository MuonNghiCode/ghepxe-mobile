import { shipRequestService } from 'src/service/shipRequestService';
import { useState } from "react";

import {
    CreateShipRequestRequest,
    CreateShipRequestResponse,
    GetShipRequestsResponse,
    GetShipRequestResponse,
    ShipRequestResponseData,
} from "src/types";

export function useShipRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Kết quả cho từng API
    const [createResult, setCreateResult] = useState<CreateShipRequestResponse | null>(null);
    const [shipRequests, setShipRequests] = useState<ShipRequestResponseData[]>([]);
    const [shipRequest, setShipRequest] = useState<ShipRequestResponseData | null>(null);

    // Hàm tạo ship request
    const createShipRequest = async (data: CreateShipRequestRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.createShip(data);
            setCreateResult(response);
            if (!response.isSuccess) {
                setError(response.error.description);
            }
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy tất cả ship requests theo userId
    const getAllShipRequests = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.getAllShipRequests(userId);
            if (response.isSuccess) {
                setShipRequests(response.value);
            } else {
                setError(response.error.description);
                setShipRequests([]);
            }
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            setShipRequests([]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy ship request theo ID
    const getShipRequestById = async (shipRequestId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.getShipRequestById(shipRequestId);
            if (response.isSuccess) {
                setShipRequest(response.value);
            } else {
                setError(response.error.description);
                setShipRequest(null);
            }
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            setShipRequest(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật ship request
    const updateShipRequest = async (shipRequestId: string, data: Partial<CreateShipRequestRequest>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.updateShipRequest(shipRequestId, data);
            if (response.isSuccess) {
                setShipRequest(response.value);
            } else {
                setError(response.error.description);
            }
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm xóa ship request
    const deleteShipRequest = async (shipRequestId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.deleteShipRequest(shipRequestId);
            if (response.isSuccess) {
                // Xóa khỏi danh sách local
                setShipRequests(prev => prev.filter(item => item.shipRequestId !== shipRequestId));
            } else {
                setError(response.error?.description || "Xóa thất bại");
            }
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm refresh danh sách
    const refreshShipRequests = async (userId: string) => {
        return await getAllShipRequests(userId);
    };

    // Hàm lấy items của ship request
    const getShipRequestItems = async (shipRequestId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.getShipRequestItems(shipRequestId);
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm thêm item vào ship request
    const addShipRequestItem = async (shipRequestId: string, itemData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.addShipRequestItem(shipRequestId, itemData);
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm cập nhật item
    const updateShipRequestItem = async (itemId: string, itemData: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.updateShipRequestItem(itemId, itemData);
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Hàm xóa item
    const deleteShipRequestItem = async (itemId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await shipRequestService.deleteShipRequestItem(itemId);
            return response;
        } catch (err: any) {
            setError(err.message || "Có lỗi xảy ra");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        createResult,
        shipRequests,
        shipRequest,
        createShipRequest,
        getAllShipRequests,
        getShipRequestById,
        updateShipRequest,
        deleteShipRequest,
        refreshShipRequests,
        getShipRequestItems,
        addShipRequestItem,
        updateShipRequestItem,
        deleteShipRequestItem,
    };
}