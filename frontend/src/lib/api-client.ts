import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden - insufficient permissions");
    }

    return Promise.reject(error);
  },
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

export interface ApiError {
  status: number;
  error: {
    code?: number;
    message: string;
    details?: string;
  };
}

// Generic API call function
export async function apiCall<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient(config);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      throw new Error(apiError?.error?.message || error.message || "An error occurred");
    }
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiCall<T>({ ...config, method: "GET", url }),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiCall<T>({ ...config, method: "POST", url, data }),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiCall<T>({ ...config, method: "PUT", url, data }),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) => apiCall<T>({ ...config, method: "DELETE", url }),
};

export default apiClient;
