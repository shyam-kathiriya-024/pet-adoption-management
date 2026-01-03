import type {
  Application,
  ApplicationListResponse,
  ApplicationQueryParams,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@/types/api.types";
import { api } from "@/lib/api-client";

export const applicationService = {
  getApplications: async (params?: ApplicationQueryParams): Promise<ApplicationListResponse> => {
    return api.get<ApplicationListResponse>("/applications", { params });
  },

  getApplicationById: async (id: string): Promise<Application> => {
    return api.get<Application>(`/applications/${id}`);
  },

  createApplication: async (data: CreateApplicationRequest): Promise<Application> => {
    return api.post<Application>("/applications", data);
  },

  updateApplicationStatus: async (id: string, data: UpdateApplicationRequest): Promise<Application> => {
    return api.put<Application>(`/applications/${id}`, data);
  },

  deleteApplication: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/applications/${id}`);
  },
};
