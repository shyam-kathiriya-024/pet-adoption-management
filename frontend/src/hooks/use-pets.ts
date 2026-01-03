import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { PetQueryParams, UpdatePetRequest } from "@/types/api.types";
import { petService } from "@/services";

export const petKeys = {
  all: ["pets"] as const,
  lists: () => [...petKeys.all, "list"] as const,
  list: (params?: PetQueryParams) => [...petKeys.lists(), params] as const,
  details: () => [...petKeys.all, "detail"] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
};

export const useGetPets = (params?: PetQueryParams, options?: { refetchOnMount?: boolean | "always" }) => {
  return useQuery({
    queryKey: petKeys.list(params),
    queryFn: () => petService.getPets(params),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: options?.refetchOnMount ?? "always",
    refetchOnWindowFocus: false,
  });
};

export const useGetPet = (id: string, enabled = true) => {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn: () => petService.getPetById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      toast.success("Pet created successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create pet";
      toast.error(message);
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetRequest }) => petService.updatePet(id, data),
    onSuccess: (data, variables) => {
      // Update the pet in cache
      queryClient.setQueryData(petKeys.detail(variables.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      toast.success("Pet updated successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update pet";
      toast.error(message);
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: petService.deletePet,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: petKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      toast.success("Pet deleted successfully!");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete pet";
      toast.error(message);
    },
  });
};
