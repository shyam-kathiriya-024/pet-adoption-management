import type { CreatePetRequest, Pet, PetListResponse, PetQueryParams, UpdatePetRequest } from "@/types/api.types";
import { api } from "@/lib/api-client";

export const petService = {
  getPets: async (params?: PetQueryParams): Promise<PetListResponse> => {
    return api.get<PetListResponse>("/pets", { params });
  },

  getPetById: async (id: string): Promise<Pet> => {
    return api.get<Pet>(`/pets/${id}`);
  },

  createPet: async (data: CreatePetRequest): Promise<Pet> => {
    return api.post<Pet>("/pets", data);
  },

  updatePet: async (id: string, data: UpdatePetRequest): Promise<Pet> => {
    return api.put<Pet>(`/pets/${id}`, data);
  },

  deletePet: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/pets/${id}`);
  },
};
