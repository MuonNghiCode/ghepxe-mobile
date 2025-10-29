import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "src/service/authService";
import { LoginRequest, ProfileResponseData, RegisterRequest } from "src/types";
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
  getProfile: () => Promise<{
    success: boolean;
    data?: ProfileResponseData;
    message?: string;
  }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  token: null,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => ({ success: false }),
  getProfile: async () => ({ success: false }),
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadSavedUserData = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        const savedRefreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setRefreshToken(savedRefreshToken);
          const userData = JSON.parse(savedUser);
          setUser(userData);

          const userRole = userData.roles?.includes("Driver")
            ? "driver"
            : "user";
          setRole(userRole);
          setIsLoggedIn(true);

          // Auto-refresh profile khi app start
          setTimeout(() => {
            getProfile();
          }, 1000);
        }
      } catch (error) {
        console.error("Error loading saved user data:", error);
      }
    };

    loadSavedUserData();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
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

        await AsyncStorage.multiSet([
          [STORAGE_KEYS.TOKEN, res.value.accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, res.value.refreshToken],
          [STORAGE_KEYS.USER, JSON.stringify(res.value.user)],
        ]);

        setTimeout(async () => {
          try {
            await getProfile();
          } catch (error) {
            console.log("Could not fetch profile after login:", error);
          }
        }, 500);

        return { success: true, message: "Đăng nhập thành công" };
      }

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
      console.error("❌ Login context error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });

      if (err?.response?.status === 400) {
        const errorData = err?.response?.data;

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
        } else if (errorData?.error?.description) {
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

  const getProfile = async () => {
    try {
      console.log("📋 Getting user profile...");
      const res = await authService.getProfile();

      if (res?.isSuccess && res?.value) {
        // Cập nhật user data trong context
        setUser(res.value);

        // Cập nhật role nếu có thay đổi
        const userRole = res.value.roles.includes("Driver") ? "driver" : "user";
        setRole(userRole);

        // Lưu vào AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(res.value)
        );

        return {
          success: true,
          data: res.value,
          message: "Lấy thông tin thành công",
        };
      }

      return {
        success: false,
        message: res?.error?.description || "Không thể lấy thông tin profile",
      };
    } catch (err: any) {
      console.error("❌ Get profile error:", err);

      if (err?.response?.status === 401) {
        // Token hết hạn, logout user
        await logout();
        return {
          success: false,
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }

      return {
        success: false,
        message:
          err?.response?.data?.detail || "Không thể lấy thông tin profile",
      };
    }
  };

  const refreshProfile = async () => {
    try {
      await getProfile();
    } catch (error) {
      console.error("Refresh profile error:", error);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        const res = await authService.logout({ refreshToken });
        console.log("Logout API response:", res);
      }

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

      return { success: true, message: "Đăng xuất thành công" };
    } catch (err: any) {
      console.error("Logout error:", err);

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
        message: "Đăng xuất thành công",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        token,
        user,
        login,
        register,
        logout,
        getProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
