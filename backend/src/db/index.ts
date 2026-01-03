import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";

import Config from "@/config";

// Get MongoDB connection URL from environment variables
const dbUrl: string = Config.env.db_uri;

if (!dbUrl) {
  throw new Error("Missing DB_URL environment variable.");
}

// establish a connection to MongoDB
mongoose
  .connect(dbUrl, {} as ConnectOptions)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err: unknown) => console.error("Could not connect to MongoDB...", err));
