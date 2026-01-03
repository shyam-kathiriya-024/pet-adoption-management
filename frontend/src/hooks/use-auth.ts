import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { User } from "@/types/api.types";
import { authService } from "@/services";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useGetMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getMe,
    enabled: authService.isAuthenticated(),
    retry: false,
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      authService.saveAuthData(data);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authService.saveAuthData(data);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Logout failed";
      toast.error(message);
    },
  });
};

export const useCurrentUser = (): User | null => {
  const { data } = useGetMe();
  return data || authService.getSavedUser();
};

export const useIsAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

export const useIsAdmin = (): boolean => {
  const user = useCurrentUser();
  return user?.user_role === "admin";
};
