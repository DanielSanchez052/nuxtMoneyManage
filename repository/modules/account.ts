import { type AsyncDataOptions } from "#app";
import FetchFactory from "../factory";
import { type ApiResponseError } from "~/types/api.js";

interface RegisterAccount {
  userId: string | null;
}

interface AccountResponse {
  id: string;
  userId: string;
  ammountBalance: number;
  status: string | null;
  accountSettings: string | null;
  isActive: boolean;
}

interface SetSettingsRequest {
  accountId: string | null;
  accountSettigs: string | null;
}

interface AccountStatusResponse {
  id: number;
  name: string | null;
}

class AccountModule extends FetchFactory {
  private BASE_URL = "/api/account";

  registerAccount(
    data: RegisterAccount,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>("POST", this.BASE_URL, JSON.stringify(data));
    }, asyncDataOptions);
  }

  getAccount(asyncDataOptions?: AsyncDataOptions<AccountResponse>) {
    return useAsyncData(() => {
      return this.call<AccountResponse>("GET", this.BASE_URL);
    }, asyncDataOptions);
  }

  updateAccountBalance(
    accountId: string,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>("POST", `${this.BASE_URL}/${accountId}/balance`);
    }, asyncDataOptions);
  }

  getAccountById(
    id: string,
    asyncDataOptions?: AsyncDataOptions<AccountResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<AccountResponse>("GET", `${this.BASE_URL}/${id}`);
    }, asyncDataOptions);
  }

  getAccountStatuses(
    asyncDataOptions?: AsyncDataOptions<AccountStatusResponse[]>,
  ) {
    return useAsyncData(() => {
      return this.call<AccountStatusResponse[]>(
        "GET",
        `${this.BASE_URL}/status`,
      );
    }, asyncDataOptions);
  }

  setAccountSettings(
    data: SetSettingsRequest,
    asyncDataOptions?: AsyncDataOptions<AccountResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<AccountResponse>(
        "POST",
        `${this.BASE_URL}/settings`,
        JSON.stringify(data),
      );
    }, asyncDataOptions);
  }
}

export default AccountModule;
