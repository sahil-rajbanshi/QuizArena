import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { loginUser, registerUser, logoutUser } from "../api/authApi";

export const useAuth = () => {
  const { login, logout, isAuthenticated, isAdmin, user } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginUser(credentials);
      // Login response: { success, data: { user: { ... }, accessToken }, message }
      const token = res.data.accessToken;
      const userData = res.data.user;
      login(token, userData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(data);
      // No token returned, just redirect to login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error("Logout API call failed:", err);
  } finally {
    logout();
    navigate("/login");
  }
};

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    clearError: () => setError(null),
  };
};