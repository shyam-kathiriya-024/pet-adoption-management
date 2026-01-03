import type { IApplication } from "@/models/application/application.types";

export type IApplicationInsert = Omit<
  IApplication,
  "application_id" | "application_archived" | "created_at" | "updated_at" | "application_status"
>;

export type IApplicationUpdate = {
  application_status: "Pending" | "Approved" | "Rejected";
};

export interface IApplicationQuery {
  user_id?: string;
  pet_id?: string;
  application_status?: "Pending" | "Approved" | "Rejected";
  page?: number;
  limit?: number;
}
