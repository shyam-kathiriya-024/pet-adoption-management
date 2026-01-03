import { z } from "zod";

// Auth Validation Schemas
export const loginSchema = z.object({
  user_email: z.string().email("Invalid email address").trim(),
  user_password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  user_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  user_email: z.string().email("Invalid email address").trim(),
  user_password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

// Pet Validation Schema
export const createPetSchema = z.object({
  pet_name: z.string().trim().min(1, "Pet name is required"),
  pet_species: z.enum(["Dog", "Cat", "Other"], {
    message: "Species must be Dog, Cat, or Other",
  }),
  pet_breed: z.string().trim().min(1, "Breed is required"),
  pet_age: z.number().min(0, "Age must be at least 0").max(30, "Age must be less than 30"),
  pet_gender: z.enum(["Male", "Female"], {
    message: "Gender must be Male or Female",
  }),
  pet_size: z.enum(["Small", "Medium", "Large"], {
    message: "Size must be Small, Medium, or Large",
  }),
  pet_description: z.string().trim().min(1, "Description is required"),
  pet_image_url: z.string().url("Invalid URL").trim(),
  pet_status: z.enum(["Available", "Pending", "Adopted"]),
  pet_location: z.string().trim().min(1, "Location is required"),
});

// Application Validation Schema
export const createApplicationSchema = z.object({
  pet_id: z.string().min(1, "Pet ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  user_name: z.string().trim().min(1, "Name is required"),
  application_message: z.string().trim().min(1, "Message is required"),
});

// TypeScript Types from Schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreatePetFormData = z.infer<typeof createPetSchema>;
export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;
