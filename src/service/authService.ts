import BaseApiService from "src/api/base";
import { API_ENDPOINTS } from "src/constants";
import { 
    LoginRequest, 
    RegisterRequest, 
    RegisterResponse,
    LogoutRequest,
    LogoutResponse,
    ProfileResponse,
    LoginResponseData,
    LoginResponse,
    RegisterResponseData,
    LogoutResponseData,
    ProfileResponseData
} from "src/types";

class AuthService extends BaseApiService {
    async signin(credentials: LoginRequest): Promise<LoginResponse> {
        return this.post<LoginResponseData>(API_ENDPOINTS.USER.LOGIN, credentials);
    }

    async signup(credentials: RegisterRequest): Promise<RegisterResponse> {
        return this.post<RegisterResponseData>(API_ENDPOINTS.USER.REGISTER, credentials);
    }

    async logout(logoutData: LogoutRequest): Promise<LogoutResponse> {
        return this.post<LogoutResponseData>(API_ENDPOINTS.USER.LOGOUT, logoutData);
    }

    async getProfile(): Promise<ProfileResponse> {
        return this.get<ProfileResponseData>(API_ENDPOINTS.USER.PROFILE);
    }
}

export const authService = new AuthService();