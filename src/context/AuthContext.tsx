import React, { createContext, useState, useContext, ReactNode } from "react";

type Role = "user" | "driver" | null;

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>(null);

  const login = (role: Role) => {
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
