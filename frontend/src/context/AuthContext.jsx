import { createContext, useContext, useState, useCallback } from "react";
import { getToken, getUser, setToken, setUser, removeToken } from "../utils/tokenUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser);
  const [token, setTokenState] = useState(getToken);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  const login = useCallback((tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    setTokenState(tokenValue);
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isAdmin, isLoading, setIsLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};
