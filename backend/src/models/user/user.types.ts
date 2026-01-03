export interface IUser {
  user_id: string;
  user_name: string;
  user_email: string;
  user_password?: string;
  user_role: "user" | "admin";
  user_status: string;
  user_archived: boolean;
}
