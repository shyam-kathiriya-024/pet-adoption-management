import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApplicationQueryParams, UpdateApplicationRequest } from "@/types/api.types";
import { applicationService } from "@/services";

export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (params?: ApplicationQueryParams) => [...applicationKeys.lists(), params] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
};

export const useGetApplications = (params?: ApplicationQueryParams, enabled = true) => {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => applicationService.getApplications(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useGetApplication = (id: string, enabled = true) => {
  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => applicationService.getApplicationById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applicationService.createApplication,
    onSuccess: () => {
      // Invalidate application lists to refetch
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to submit application";
      toast.error(message);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationRequest }) =>
      applicationService.updateApplicationStatus(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(applicationKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Application status updated successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update application status";
      toast.error(message);
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applicationService.deleteApplication,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: applicationKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      toast.success("Application deleted successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete application";
      toast.error(message);
    },
  });
};
