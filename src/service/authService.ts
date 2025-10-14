import BaseApiService from "src/api/base";
import { API_ENDPOINTS } from "src/constants";
import { 
    LoginRequest, 
    ActualLoginResponse, 
    RegisterRequest, 
    RegisterResponse,
    LogoutRequest,
    LogoutResponse
} from "src/types";

class AuthService extends BaseApiService {
    async signin(credentials: LoginRequest): Promise<ActualLoginResponse> {
        const response = await this.post<ActualLoginResponse>(API_ENDPOINTS.USER.LOGIN, credentials);
        return response.data || response;
    }

    async signup(credentials: RegisterRequest): Promise<RegisterResponse> {
        const response = await this.post<RegisterResponse>(API_ENDPOINTS.USER.REGISTER, credentials);
        return response.data || response;
    }

    async logout(logoutData: LogoutRequest): Promise<LogoutResponse> {
        const response = await this.post<LogoutResponse>(API_ENDPOINTS.USER.LOGOUT, logoutData);
        return response.data || response;
    }
}

export const authService = new AuthService();