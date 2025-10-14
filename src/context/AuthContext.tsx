import React, { createContext, useState, useContext, ReactNode } from "react";
import { authService } from "src/service/authService";
import { LoginRequest, RegisterRequest } from "src/types";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  token: null,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (credentials: LoginRequest) => {
    try {
      const res = await authService.signin(credentials);

      // Kiểm tra response theo cấu trúc mới
      if (res?.isSuccess && res?.value?.accessToken && res?.value?.user) {
        setIsLoggedIn(true);
        // Map roles array to single role
        const userRole = res.value.user.roles.includes("Driver")
          ? "driver"
          : "user";
        setRole(userRole);
        setToken(res.value.accessToken);
        setUser(res.value.user);
        return { success: true, message: "Đăng nhập thành công" };
      }

      return {
        success: false,
        message: res?.error?.description || "Sai tài khoản hoặc mật khẩu",
      };
    } catch (err: any) {
      console.error("Login error:", err);
      return {
        success: false,
        message:
          err?.response?.data?.error?.description || "Đăng nhập thất bại",
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

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setToken(null);
    setUser(null);
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
