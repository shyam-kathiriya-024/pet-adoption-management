export interface AuditFields {
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
}

export interface SoftDeleteFields {
  is_deleted: boolean;
  deleted_at: Date | null;
}
