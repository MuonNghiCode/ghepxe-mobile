import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "src/navigation/RootNavigation";
import { ErrorResponseModel, ResponseModel } from "src/types";
import { API_BASE_URL, API_HEADERS, STORAGE_KEYS } from "src/constants";


class BaseApiService {
  protected api: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000, 
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // === Request interceptor ===
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // === Response interceptor ===
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        // Nếu token hết hạn → xóa token và điều hướng về Login
        if (error.response?.status === 401) {
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.TOKEN,
            STORAGE_KEYS.USER,
          ]);

          // Dùng React Navigation để điều hướng
          if (navigationRef.isReady()) {
            navigationRef.navigate("Login" as never);
          }
        }

        // Chuẩn hóa lỗi trả về
        const errorResponse: ErrorResponseModel = {
          success: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra. Vui lòng thử lại.",
          error: error.response?.data?.error || error.message,
        };

        return Promise.reject(errorResponse);
      }
    );
  }

  // === Các hàm CRUD chung ===
  protected async get<T>(url: string, params?: any): Promise<ResponseModel<T>> {
    const response = await this.api.get<ResponseModel<T>>(url, { params });
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: any
  ): Promise<ResponseModel<T>> {
    const response = await this.api.post<ResponseModel<T>>(url, data);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: any
  ): Promise<ResponseModel<T>> {
    const response = await this.api.put<ResponseModel<T>>(url, data);
    return response.data;
  }

  protected async delete<T>(url: string): Promise<ResponseModel<T>> {
    const response = await this.api.delete<ResponseModel<T>>(url);
    return response.data;
  }
}

export default BaseApiService;
