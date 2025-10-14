import BaseApiService from "src/api/base";
import { API_ENDPOINTS } from "src/constants";
import { LoginRequest, ActualLoginResponse, RegisterRequest, RegisterResponse } from "src/types";

class AuthService extends BaseApiService {
    async signin(credentials: LoginRequest): Promise<ActualLoginResponse> {
        const response = await this.post<ActualLoginResponse>(API_ENDPOINTS.USER.LOGIN, credentials);
        return response.data || response;
    }

    async signup(credentials: RegisterRequest): Promise<RegisterResponse> {
        const response = await this.post<RegisterResponse>(API_ENDPOINTS.USER.REGISTER, credentials);
        return response.data || response;
    }
}

export const authService = new AuthService();