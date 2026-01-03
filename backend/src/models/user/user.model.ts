import type { Model } from "mongoose";
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

import type { IUser } from "./user.types";

interface IUserDoc extends IUser, mongoose.Document {}

interface IUserModel extends Model<IUserDoc> {}

const userSchema = new Schema<IUserDoc>(
  {
    user_id: {
      type: String,
      default: uuid,
    },
    user_name: {
      type: String,
      trim: true,
      required: true,
    },
    user_email: {
      type: String,
      trim: true,
    },
    user_password: {
      type: String,
      trim: true,
    },
    user_role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    user_status: {
      type: String,
      default: "active",
      trim: true,
    },
    user_archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("user_password")) {
    return next();
  }

  if (this.user_password) {
    const salt = await bcrypt.genSalt(10);
    this.user_password = await bcrypt.hash(this.user_password, salt);
  }

  next();
});

const UserModel = mongoose.model<IUserDoc, IUserModel>("users", userSchema);

export default UserModel;
