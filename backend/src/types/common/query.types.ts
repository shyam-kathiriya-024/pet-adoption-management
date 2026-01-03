export type UR = Record<string, unknown>;

export type SortOrder = 1 | -1;

export type Operator =
  | "neq"
  | "in"
  | "nin"
  | "nl"
  | "nnl"
  | "sw"
  | "ew"
  | "lte"
  | "gte"
  | "lt"
  | "gt"
  | "ltegte"
  | "eq";

export interface GlobalFilterData {
  global_value?: string;
  global_filter?: string[];
}

export interface FieldFilterItem {
  field: string;
  value: unknown;
  operator: Operator;
  type: string;
  subType: string;
}

export type IQueryFieldBuilderParams = Omit<FieldFilterItem, "field" | "type">;

export interface PaginationData extends GlobalFilterData {
  page_size?: string | number;
  page_index?: string | number;
  filters?: FieldFilterItem[];
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface PaginatedResult<T> {
  count: number;
  docs: T[];
}

export type ExportData = Omit<PaginationData, "page_size" | "page_index">;

export type ExportResult<T> = Omit<PaginatedResult<T>, "count">;

export type PaginatePluginFn<DocType> = (
  data: PaginationData,
  condition?: Record<string, unknown>,
  fieldData?: Partial<Record<keyof DocType, 0 | 1>>,
) => Promise<PaginatedResult<Partial<DocType>>>;

export type FileExportPluginFn<DocType> = (
  data: ExportData,
  condition?: Record<string, unknown>,
  fieldData?: Partial<Record<keyof DocType, 0 | 1>>,
) => Promise<ExportResult<Partial<DocType>>>;
