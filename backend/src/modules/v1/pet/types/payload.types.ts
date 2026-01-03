import type { IPet } from "@/models/pet/pet.types";

export type IPetInsert = Omit<IPet, "pet_id" | "pet_archived" | "created_at" | "updated_at">;

export type IPetUpdate = Partial<Omit<IPet, "pet_id" | "created_at" | "updated_at">>;

export interface IPetQuery {
  search?: string;
  species?: "Dog" | "Cat" | "Other" | "All";
  breed?: string;
  minAge?: number;
  maxAge?: number;
  status?: "Available" | "Pending" | "Adopted";
  page?: number;
  limit?: number;
}
