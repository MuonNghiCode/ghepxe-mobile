import React, { createContext, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "src/service/authService";
import { LoginRequest, RegisterRequest } from "src/types";
import { STORAGE_KEYS } from "src/constants";

type Role = "user" | "driver" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  token: string | null;
  user: any;
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    credentials: RegisterRequest
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  token: null,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      console.log("Starting login process...");
      const res = await authService.signin(credentials);

      if (res?.isSuccess && res?.value?.accessToken && res?.value?.user) {
        setIsLoggedIn(true);
        const userRole = res.value.user.roles.includes("Driver")
          ? "driver"
          : "user";
        setRole(userRole);
        setToken(res.value.accessToken);
        setRefreshToken(res.value.refreshToken);
        setUser(res.value.user);

        // Lưu vào AsyncStorage
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.TOKEN, res.value.accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, res.value.refreshToken],
          [STORAGE_KEYS.USER, JSON.stringify(res.value.user)],
        ]);

        return { success: true, message: "Đăng nhập thành công" };
      }

      // Nếu response không success nhưng có cấu trúc API đúng
      if (res?.isFailure) {
        const errorDescription = res?.error?.description || "";
        let errorMessage = "Đăng nhập thất bại";

        if (errorDescription) {
          if (
            errorDescription.toLowerCase().includes("password") ||
            errorDescription.toLowerCase().includes("mật khẩu")
          ) {
            errorMessage = "Mật khẩu không chính xác!";
          } else if (
            errorDescription.toLowerCase().includes("email") ||
            errorDescription.toLowerCase().includes("user") ||
            errorDescription.toLowerCase().includes("not found")
          ) {
            errorMessage = "Tài khoản không tồn tại!";
          } else if (errorDescription.toLowerCase().includes("invalid")) {
            errorMessage = "Sai tài khoản hoặc mật khẩu!";
          } else {
            errorMessage = errorDescription;
          }
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      return {
        success: false,
        message: "Sai tài khoản hoặc mật khẩu!",
      };
    } catch (err: any) {
      console.error("Login context error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });

      // Xử lý lỗi HTTP status codes với cấu trúc mới
      if (err?.response?.status === 400) {
        const errorData = err?.response?.data;

        // Xử lý cấu trúc error mới từ API
        if (errorData?.detail) {
          const detail = errorData.detail.toLowerCase();

          if (
            detail.includes("invalid email or password") ||
            detail.includes("invalid credentials")
          ) {
            return {
              success: false,
              message: "Sai tài khoản hoặc mật khẩu!",
            };
          } else if (detail.includes("password")) {
            return {
              success: false,
              message: "Mật khẩu không chính xác!",
            };
          } else if (detail.includes("email") || detail.includes("user")) {
            return {
              success: false,
              message: "Tài khoản không tồn tại!",
            };
          } else {
            return {
              success: false,
              message: errorData.detail,
            };
          }
        }

        // Fallback cho cấu trúc cũ
        else if (errorData?.error?.description) {
          return {
            success: false,
            message: errorData.error.description,
          };
        } else if (errorData?.message) {
          return {
            success: false,
            message: errorData.message,
          };
        }
      } else if (err?.response?.status === 401) {
        return {
          success: false,
          message: "Sai tài khoản hoặc mật khẩu!",
        };
      } else if (err?.response?.status === 404) {
        return {
          success: false,
          message: "Tài khoản không tồn tại!",
        };
      } else if (err.message === "Network Error") {
        return {
          success: false,
          message:
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        };
      }

      return {
        success: false,
        message: "Sai tài khoản hoặc mật khẩu!",
      };
    }
  };

  const register = async (credentials: RegisterRequest) => {
    try {
      const res = await authService.signup(credentials);

      if (res?.isSuccess) {
        return { success: true, message: "Đăng ký thành công" };
      }

      return {
        success: false,
        message: res?.error?.description || "Đăng ký thất bại",
      };
    } catch (err: any) {
      console.error("Register error:", err);
      return {
        success: false,
        message: err?.response?.data?.error?.description || "Đăng ký thất bại",
      };
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout nếu có refreshToken
      if (refreshToken) {
        const res = await authService.logout({ refreshToken });
        console.log("Logout API response:", res);
      }

      // Clear state
      setIsLoggedIn(false);
      setRole(null);
      setToken(null);
      setRefreshToken(null);
      setUser(null);

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);

      return { success: true, message: "Đăng xuất thành công" };
    } catch (err: any) {
      console.error("Logout error:", err);

      // Vẫn clear local state ngay cả khi API fail
      setIsLoggedIn(false);
      setRole(null);
      setToken(null);
      setRefreshToken(null);
      setUser(null);

      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);

      return {
        success: true,
        message: "Đăng xuất thành công", // Vẫn thành công vì đã clear local
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, token, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
