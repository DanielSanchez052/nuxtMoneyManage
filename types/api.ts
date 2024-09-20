export type ApiResponse = {
  data: any;
  success: boolean;
  errors: Array<ApiError>;
  statusText: string;
  headers: any;
  config: any;
  status: number;
};

export type ApiResponseError = {
  errors: ApiError[];
};

export type ApiError = {
  code: string;
  message: string;
};

export type Pagination = {
  PageIndex: number;
  PageSize: number;
};

export type PaginatedResult<ResultType> = {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: ResultType[];
};

export type TypeProp = {
  id: number;
  name: string;
  nameT: string | undefined;
};

export enum TransactionType {
  movement = 1,
  spend = 2,
  revenue = 3,
}

export type Settings = {
  theme: string;
  lang: string;
  // loanSource?: Source
};

export type DateRange = {
  start: string;
  end: string;
};
