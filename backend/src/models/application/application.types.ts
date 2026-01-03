export interface IApplication {
  application_id: string;
  pet_id: string;
  user_id: string;
  user_name: string;
  application_status: "Pending" | "Approved" | "Rejected";
  application_message: string;
  application_archived: boolean;
  created_at: Date;
  updated_at: Date;
}
