import axios from "axios";
import { getToken, removeToken, setToken } from "../utils/tokenUtils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — try refresh once, then give up
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s, and never retry the refresh call itself or auth endpoints
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the ongoing refresh finishes
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axiosInstance.post("/auth/refresh");
      const newToken = res.data.data.accessToken;
      setToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      removeToken();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
