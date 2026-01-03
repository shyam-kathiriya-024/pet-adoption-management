import type { FilterQuery } from "mongoose";

import type { IApplication } from "@/models/application/application.types";
import type { IPet } from "@/models/pet/pet.types";
import ApplicationModel from "@/models/application/application.model";
import PetModel from "@/models/pet/pet.model";
import errorManager from "@/utils/error-manager";

import type { IApplicationInsert, IApplicationQuery, IApplicationUpdate } from "../types";

interface IApplicationWithPet extends IApplication {
  pet?: IPet | null;
}

interface AggregationResult {
  applications: IApplicationWithPet[];
  totalCount: { count: number }[];
}

const applicationInsert = async (data: IApplicationInsert) => {
  const pet = await PetModel.findOne({ pet_id: data.pet_id, pet_archived: false });

  if (!pet) {
    throw errorManager.getHttpError("PET_NOT_FOUND");
  }

  if (pet.pet_status !== "Available") {
    throw errorManager.getHttpError("PET_NOT_AVAILABLE");
  }

  const existingApplication = await ApplicationModel.findOne({
    pet_id: data.pet_id,
    user_id: data.user_id,
    application_status: { $in: ["Pending", "Approved"] },
    application_archived: false,
  });

  if (existingApplication) {
    throw errorManager.getHttpError("DUPLICATE_APPLICATION");
  }

  const response = await ApplicationModel.create(data);
  return response;
};

const getApplications = async (query: IApplicationQuery) => {
  const { user_id, pet_id, application_status, page = 1, limit = 10 } = query;

  // Build match stage
  const matchStage: FilterQuery<IApplication> = { application_archived: false };

  if (user_id) {
    matchStage.user_id = user_id;
  }

  if (pet_id) {
    matchStage.pet_id = pet_id;
  }

  if (application_status) {
    matchStage.application_status = application_status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute aggregation query with pet details
  const result = await ApplicationModel.aggregate<AggregationResult>([
    { $match: matchStage },
    { $sort: { created_at: -1 } },
    {
      $facet: {
        applications: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "pets",
              localField: "pet_id",
              foreignField: "pet_id",
              as: "pet_details",
            },
          },
          {
            $unwind: {
              path: "$pet_details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: {
              pet: {
                $cond: {
                  if: { $eq: ["$pet_details.pet_archived", false] },
                  then: "$pet_details",
                  else: null,
                },
              },
            },
          },
          {
            $project: {
              pet_details: 0,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const aggregationResult = result[0];
  const applications = aggregationResult?.applications ?? [];
  const total = aggregationResult?.totalCount[0]?.count ?? 0;

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getApplicationById = async (applicationId: string) => {
  const application = await ApplicationModel.findOne({
    application_id: applicationId,
    application_archived: false,
  });
  return application;
};

const updateApplicationStatus = async (applicationId: string, data: IApplicationUpdate) => {
  const application = await ApplicationModel.findOneAndUpdate(
    { application_id: applicationId, application_archived: false },
    { application_status: data.application_status },
    { new: true },
  );

  if (!application) {
    return null;
  }

  // If approved, update pet status to Adopted
  if (data.application_status === "Approved") {
    await PetModel.findOneAndUpdate({ pet_id: application.pet_id }, { pet_status: "Adopted" });

    // Reject all other pending applications for this pet
    await ApplicationModel.updateMany(
      {
        pet_id: application.pet_id,
        application_id: { $ne: applicationId },
        application_status: "Pending",
      },
      { application_status: "Rejected" },
    );
  }

  return application;
};

const deleteApplication = async (applicationId: string) => {
  // Soft delete by setting archived to true
  const application = await ApplicationModel.findOneAndUpdate(
    { application_id: applicationId },
    { application_archived: true },
    { new: true },
  );
  return application;
};

export default {
  applicationInsert,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
