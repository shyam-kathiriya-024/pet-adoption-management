import type { Model } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

import type { IPet } from "./pet.types";

interface IPetDoc extends IPet, mongoose.Document {}

interface IPetModel extends Model<IPetDoc> {}

const petSchema = new Schema<IPetDoc>(
  {
    pet_id: {
      type: String,
      default: uuid,
    },
    pet_name: {
      type: String,
      trim: true,
      required: true,
    },
    pet_species: {
      type: String,
      enum: ["Dog", "Cat", "Other"],
      required: true,
    },
    pet_breed: {
      type: String,
      trim: true,
      required: true,
    },
    pet_age: {
      type: Number,
      required: true,
    },
    pet_gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    pet_size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      required: true,
    },
    pet_description: {
      type: String,
      trim: true,
      required: true,
    },
    pet_image_url: {
      type: String,
      trim: true,
      required: true,
    },
    pet_status: {
      type: String,
      enum: ["Available", "Pending", "Adopted"],
      default: "Available",
    },
    pet_location: {
      type: String,
      trim: true,
      required: true,
    },
    pet_archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const PetModel = mongoose.model<IPetDoc, IPetModel>("pets", petSchema);

export default PetModel;
