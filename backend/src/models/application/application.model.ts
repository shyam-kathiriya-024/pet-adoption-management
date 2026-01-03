import type { Model } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

import type { IApplication } from "./application.types";

interface IApplicationDoc extends IApplication, mongoose.Document {}

interface IApplicationModel extends Model<IApplicationDoc> {}

const applicationSchema = new Schema<IApplicationDoc>(
  {
    application_id: {
      type: String,
      default: uuid,
    },
    pet_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      trim: true,
      required: true,
    },
    application_status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    application_message: {
      type: String,
      trim: true,
      required: true,
    },
    application_archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const ApplicationModel = mongoose.model<IApplicationDoc, IApplicationModel>("applications", applicationSchema);

export default ApplicationModel;
