export interface IPet {
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
  created_at: Date;
  updated_at: Date;
}
