import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types/api.types";
import { api } from "@/lib/api-client";

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/register", data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", data);
  },

  getMe: async (): Promise<User> => {
    return api.get<User>("/auth/me");
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  saveAuthData: (data: AuthResponse) => {
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },

  getSavedUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getSavedToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("auth_token");
  },
};
