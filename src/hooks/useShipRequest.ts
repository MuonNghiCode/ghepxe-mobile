import { shipRequestService} from 'src/service/shipRequestService';
import { useState } from "react";

import {
    CreateShipRequestRequest,
    CreateShipRequestResponse,
    // Thêm các type khác nếu cần cho các API khác
} from "src/types";

export function useShipRequest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Kết quả cho từng API, có thể mở rộng thêm nếu cần
    const [createResult, setCreateResult] = useState<CreateShipRequestResponse | null>(null);

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

    // Có thể bổ sung thêm các hàm khác như getShipRequests, updateShipRequest, deleteShipRequest...

    return {
        loading,
        error,
        createResult,
        createShipRequest,
        // Thêm các hàm khác nếu cần
    };
}