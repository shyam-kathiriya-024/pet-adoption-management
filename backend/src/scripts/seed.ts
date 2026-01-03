import dotenv from "dotenv";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import ApplicationModel from "../models/application/application.model";
import PetModel from "../models/pet/pet.model";
import UserModel from "../models/user/user.model";

// Load environment variables
dotenv.config();

const DB_URI = process.env.DB_URI ?? "mongodb://localhost:27017/pet-adoption";

// Mock Data from frontend
const MOCK_PETS = [
  {
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "Male",
    size: "Large",
    description:
      "Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He gets along great with kids and other dogs.",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    status: "Available",
    location: "New York, NY",
  },
  {
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: 1,
    gender: "Female",
    size: "Small",
    description:
      "Luna is a vocal and affectionate Siamese cat. She loves to curl up in your lap and purr while you watch TV.",
    imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800&q=80",
    status: "Available",
    location: "Brooklyn, NY",
  },
  {
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    age: 4,
    gender: "Male",
    size: "Large",
    description:
      "Max is a loyal and protective German Shepherd. He is well-trained and would make a great companion for an active individual or family.",
    imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80",
    status: "Pending",
    location: "Queens, NY",
  },
  {
    name: "Mittens",
    species: "Cat",
    breed: "Tabby",
    age: 0.5,
    gender: "Female",
    size: "Small",
    description: "Mittens is a playful and curious kitten. She loves to chase laser pointers and climb cat trees.",
    imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
    status: "Adopted",
    location: "Jersey City, NJ",
  },
  {
    name: "Rocky",
    species: "Dog",
    breed: "Bulldog",
    age: 3,
    gender: "Male",
    size: "Medium",
    description:
      "Rocky is a laid-back Bulldog who loves to nap and eat treats. He is great with other pets and loves to cuddle.",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
    status: "Available",
    location: "Staten Island, NY",
  },
  {
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: 2,
    gender: "Male",
    size: "Medium",
    description:
      "Charlie is a curious Beagle with a nose for adventure. He loves sniffing around in the park and meeting new people.",
    imageUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
    status: "Available",
    location: "Hoboken, NJ",
  },
  {
    name: "Bella",
    species: "Cat",
    breed: "Maine Coon",
    age: 3,
    gender: "Female",
    size: "Large",
    description: "Bella is a gentle giant. This Maine Coon loves to be brushed and has a very calm demeanor.",
    imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=800&q=80",
    status: "Available",
    location: "Manhattan, NY",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Connecting to database...");
    await mongoose.connect(DB_URI);
    console.log("✅ Database connected!");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await UserModel.deleteMany({});
    await PetModel.deleteMany({});
    await ApplicationModel.deleteMany({});

    // Create Admin User
    console.log("👤 Creating users...");
    const adminUser = await UserModel.create({
      user_name: "Admin User",
      user_email: "admin@example.com",
      user_password: "password123", // Will be hashed by pre-save hook
      user_role: "admin",
      user_status: "active",
      user_id: uuidv4(),
    });
    console.log("   ✅ Admin created (admin@example.com / password123)");

    // Create Normal User
    const normalUser = await UserModel.create({
      user_name: "John Doe",
      user_email: "user@example.com",
      user_password: "password123", // Will be hashed by pre-save hook
      user_role: "user",
      user_status: "active",
      user_id: uuidv4(),
    });
    console.log("   ✅ User created (user@example.com / password123)");

    // Create Pets
    console.log("🐾 Creating pets...");
    const pets = MOCK_PETS.map((pet) => ({
      pet_id: uuidv4(),
      pet_name: pet.name,
      pet_species: pet.species,
      pet_breed: pet.breed,
      pet_age: pet.age,
      pet_gender: pet.gender,
      pet_size: pet.size,
      pet_description: pet.description,
      pet_image_url: pet.imageUrl,
      pet_status: pet.status,
      pet_location: pet.location,
      pet_archived: false,
    }));

    await PetModel.insertMany(pets);
    console.log(`   ✅ ${pets.length} pets created`);

    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Database disconnected");
  }
};

void seedDatabase();
