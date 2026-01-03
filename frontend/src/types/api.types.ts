// User types
export interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: "user" | "admin";
  user_status: string;
  user_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  user_email: string;
  user_password: string;
}

export interface RegisterRequest {
  user_name: string;
  user_email: string;
  user_password: string;
}

// Pet types
export interface Pet {
  pet_id: string;
  pet_name: string;
  pet_species: "Dog" | "Cat" | "Other";
  pet_breed: string;
  pet_age: number;
  pet_gender: "Male" | "Female";
  pet_size: "Small" | "Medium" | "Large";
  pet_description: string;
  pet_image_url: string;
  pet_status: "Available" | "Pending" | "Adopted";
  pet_location: string;
  pet_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PetListResponse {
  pets: Pet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PetQueryParams {
  search?: string;
  species?: "Dog" | "Cat" | "Other" | "All";
  breed?: string;
  minAge?: number;
  maxAge?: number;
  status?: "Available" | "Pending" | "Adopted";
  page?: number;
  limit?: number;
}

export interface CreatePetRequest {
  pet_name: string;
  pet_species: "Dog" | "Cat" | "Other";
  pet_breed: string;
  pet_age: number;
  pet_gender: "Male" | "Female";
  pet_size: "Small" | "Medium" | "Large";
  pet_description: string;
  pet_image_url: string;
  pet_status?: "Available" | "Pending" | "Adopted";
  pet_location: string;
}

export type UpdatePetRequest = Partial<CreatePetRequest>;

// Application types
export interface Application {
  application_id: string;
  pet_id: string;
  user_id: string;
  user_name: string;
  application_status: "Pending" | "Approved" | "Rejected";
  application_message: string;
  application_archived: boolean;
  created_at: string;
  updated_at: string;
  pet?: Pet | null;
}

export interface ApplicationListResponse {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApplicationQueryParams {
  user_id?: string;
  pet_id?: string;
  application_status?: "Pending" | "Approved" | "Rejected";
  page?: number;
  limit?: number;
}

export interface CreateApplicationRequest {
  pet_id: string;
  user_id: string;
  user_name: string;
  application_message: string;
}

export interface UpdateApplicationRequest {
  application_status: "Pending" | "Approved" | "Rejected";
}
