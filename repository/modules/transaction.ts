import { type AsyncDataOptions } from "#app";
import FetchFactory from "../factory";
import type {
  ApiResponseError,
  PaginatedResult,
  Pagination,
  TypeProp,
} from "~/types/api.js";
import type {
  TransactionFilters,
  Transaction,
  NewTransaction,
  ExtendedProperty,
  UpdateTransactionAmmountRequest,
} from "~/types/transactions";

class TransactionModule extends FetchFactory {
  private BASE_URL = "/api/transaction";

  createTransaction(
    data: NewTransaction,
    asyncDataOptions?: AsyncDataOptions<Transaction>,
  ) {
    return useAsyncData(() => {
      return this.call<Transaction>(
        "POST",
        this.BASE_URL,
        JSON.stringify(data),
      );
    }, asyncDataOptions);
  }

  getTransactions(
    params: TransactionFilters,
    pagination: Pagination,
    asyncDataOptions?: AsyncDataOptions<PaginatedResult<Transaction>>,
  ) {
    const queryStringFilters = new URLSearchParams(params as any).toString();
    const queryStringPagination = new URLSearchParams(
      pagination as any,
    ).toString();

    if (!asyncDataOptions) {
      asyncDataOptions = {};
    }

    asyncDataOptions.transform = (data): PaginatedResult<Transaction> => {
      console.log(data);
      return data;
      // return {
      //   ...data,
      //   items: data.items.map((tr) => this._transformTransactions(tr)),
      // };
    };

    return useAsyncData(() => {
      return this.call<PaginatedResult<Transaction>>(
        "GET",
        `${this.BASE_URL}?${queryStringPagination}&${queryStringPagination}`,
      );
    }, asyncDataOptions);
  }

  updateTransactionAmount(
    data: UpdateTransactionAmmountRequest,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>(
        "PUT",
        `${this.BASE_URL}/ammount`,
        JSON.stringify(data),
      );
    }, asyncDataOptions);
  }

  deleteTransaction(id: string, asyncDataOptions?: AsyncDataOptions<void>) {
    return useAsyncData(() => {
      return this.call<void>("DELETE", `${this.BASE_URL}/${id}`);
    }, asyncDataOptions);
  }

  getTransactionById(
    id: string,
    asyncDataOptions?: AsyncDataOptions<Transaction>,
  ) {
    asyncDataOptions.transform = this._transformTransactions;

    return useAsyncData(() => {
      return this.call<Transaction>("GET", `${this.BASE_URL}/${id}`);
    }, asyncDataOptions);
  }

  getTransactionTypes(asyncDataOptions?: AsyncDataOptions<TypeProp[]>) {
    return useAsyncData(() => {
      return this.call<TypeProp[]>("GET", `${this.BASE_URL}/types`);
    }, asyncDataOptions);
  }

  _transformTransactions(tr: Transaction): Transaction {
    return {
      ...tr,
      typeName: tr.type?.name ?? "",
      sourceName: tr.source?.name ?? "",
      type: {
        id: tr.type.id,
        name: tr.type.name,
        nameT: tr.type?.name ?? "",
      },
    };
  }
}

export default TransactionModule;
