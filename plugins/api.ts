import { $fetch as fetcher, type FetchOptions } from "ofetch";

import AuthenticationModule from "~/repository/modules/authentication";
import TransactionModule from "~/repository/modules/transaction";
import { useAuthStore } from "~/stores/auth-store.js";

interface IApiInstance {
  authentication: AuthenticationModule;
  transaction: TransactionModule;
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const { user } = storeToRefs(useAuthStore());

  const fetchOptions: FetchOptions = {
    baseURL: config.public.apiBaseUrl,
    headers: {
      Authorization: "Bearer " + user?.value?.token,
    },
  };

  const apiFetcher = fetcher.create(fetchOptions);

  const fetchAuthenticationOptions: FetchOptions = {
    baseURL: config.public.apiAuthBaseUrl,
  };

  const authApiFetcher = fetcher.create(fetchAuthenticationOptions);

  const modules: IApiInstance = {
    authentication: new AuthenticationModule(authApiFetcher),
    transaction: new TransactionModule(apiFetcher),
  };

  return {
    provide: {
      api: modules,
    },
  };
});
