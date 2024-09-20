import type { TypeProp, DateRange } from "./api.js";
import type { Source } from "./sources.js";

export type TransactionFilters = {
  Type: TypeProp | null;
  Source: Source | null;
  AccountId: string | null;
  TransactionDateRange: DateRange | null;
};

export type Transaction = {
  id: string;
  accountId: string;
  ammount: number;
  transactionDate: string;
  type: TypeProp;
  typeName: string;
  source: Source;
  sourceName: string;
  isActive: boolean;
  transactionExtendedProperties: ExtendedProperty[];
};

export type NewTransaction = {
  accountId: string;
  ammount: number;
  transactionDate: string;
  type: number;
  sourceId: string;
  transactionExtendedProperties: ExtendedProperty[];
};

export type ExtendedProperty = {
  displayName: string;
  key: string;
  value: string;
};

export type UpdateTransactionAmmountRequest = {
  transactionId?: string;
  ammount: number;
};
