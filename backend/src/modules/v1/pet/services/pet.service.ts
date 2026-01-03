import type { UR } from "@/types";
import PetModel from "@/models/pet/pet.model";

import type { IPetInsert, IPetQuery, IPetUpdate } from "../types";

const petInsert = async (data: IPetInsert) => {
  const response = await PetModel.create(data);
  return response;
};

const getPets = async (query: IPetQuery) => {
  const { search, species, breed, minAge, maxAge, status, page = 1, limit = 10 } = query;

  // Build filter object
  const filter: UR = { pet_archived: false };

  // Search by name or breed
  if (search) {
    filter.$or = [{ pet_name: { $regex: search, $options: "i" } }, { pet_breed: { $regex: search, $options: "i" } }];
  }

  // Filter by species
  if (species && species !== "All") {
    filter.pet_species = species;
  }

  // Filter by breed
  if (breed) {
    filter.pet_breed = { $regex: breed, $options: "i" };
  }

  // Filter by age range
  if (minAge !== undefined || maxAge !== undefined) {
    filter.pet_age = {} as { $gte?: number; $lte?: number };
    if (minAge !== undefined) {
      (filter.pet_age as { $gte?: number }).$gte = minAge;
    }
    if (maxAge !== undefined) {
      (filter.pet_age as { $lte?: number }).$lte = maxAge;
    }
  }

  // Filter by status
  if (status) {
    filter.pet_status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const [pets, total] = await Promise.all([
    PetModel.find(filter).skip(skip).limit(limit).sort({ created_at: -1 }),
    PetModel.countDocuments(filter),
  ]);

  return {
    pets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPetById = async (petId: string) => {
  const pet = await PetModel.findOne({ pet_id: petId, pet_archived: false });
  return pet;
};

const updatePet = async (petId: string, data: IPetUpdate) => {
  const pet = await PetModel.findOneAndUpdate({ pet_id: petId, pet_archived: false }, data, { new: true });
  return pet;
};

const deletePet = async (petId: string) => {
  const pet = await PetModel.findOneAndUpdate({ pet_id: petId }, { pet_archived: true }, { new: true });
  return pet;
};

export default {
  petInsert,
  getPets,
  getPetById,
  updatePet,
  deletePet,
};
