import { BASE_URL } from '@env';

export const API_BASE_URL = BASE_URL || "http://10.0.2.2:5000";
console.log("BASE_URL:", BASE_URL);

export const API_ENDPOINTS = {
  USER: {
    REGISTER: "/api/User/register",
    LOGIN: "/api/User/login",
    REFRESH_TOKEN: "/api/User/refresh-token",
    LOGOUT: "/api/User/logout",
    PROFILE: "/api/User/profile",
    READ_ALL: "/api/User/read",
    HEALTH: "/api/User/health",
  },
  SHIP_REQUEST: {
    CREATE: "/api/User/ShipRequest",
    GET_ALL: "/api/User/ShipRequest",
    UPDATE: "/api/User/ShipRequest",
    DELETE: "/api/User/ShipRequest",
    GET_BY_USER: "/api/User/ShipRequest/user/{userId}",
    HEALTH: "/api/User/ShipRequest/health",
    GET_DETAILS: "/api/User/ShipRequest/{shipRequestId}/Item",
    ADD_ITEM: "/api/User/ShipRequest/{shipRequestId}/Item",
    UPDATE_ITEM: "/api/User/ShipRequest/Item/{itemId}",
    DELETE_ITEM: "/api/User/ShipRequest/Item/{itemId}",
  },
  ROUTE_REQUEST: {
    CREATE: "/api/Driver/RouteRequest",
    GET_ALL: "/api/Driver/RouteRequest",
    GET_DETAIL: "/api/Driver/RouteRequest/{routeRequestId}",
    DELETE: "/api/Driver/RouteRequest/{routeRequestId}",
    UPDATE: "/api/Driver/RouteRequest/{routeRequestId}",
    ASSIGN: "/api/Driver/RouteRequest/{routeRequestId}/ship-request",
  },
  GEMINI: {
    MATCHING: "api/User/Gemini/Matching"
  },
  VEHICLE: {
    CREATE_VEHICLE: "/api/Driver/Vehicle/create",
    GET_ALL_VEHICLES: "/api/Driver/Vehicle/my-vehicles",
  },
  FILE: {
    UPLOAD: "/api/User/File/upload",
    GET_FILE: "/api/User/File/presigned-url/{fileId}"
  }
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
} as const;

// ✅ Common Headers
export const API_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
} as const;

// ✅ Error Messages (thống nhất toàn app)
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Không thể kết nối tới máy chủ",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn",
  FORBIDDEN: "Bạn không có quyền truy cập",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  SERVER_ERROR: "Lỗi máy chủ nội bộ",
  VALIDATION_ERROR: "Dữ liệu nhập không hợp lệ",
} as const;
