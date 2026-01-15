import axios from "axios";
import { getAuthCookie } from "./token";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * → attaches Authorization header if token exists
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor (optional, future-ready)
 * → handle 401 globally later
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // optional future logic:
      // clearToken();
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
