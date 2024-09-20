// import AuthService from '../api/users/auth.service'
// import AccountService from '../api/transactions/account.service'
import {
  type Login,
  type NewUser,
  type User,
  type Account,
} from "~/types/auth";
import { type ApiError, type ApiResponseError } from "~/types/api.js";

const user: User =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem("user") ?? "{}")
    : undefined;

const account: Account =
  typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem("account") ?? "{}")
    : undefined;

const initialState = user
  ? { status: { loggedIn: true }, user, account }
  : { status: { loggedIn: false }, user: null, account: null };

export const useAuthStore = defineStore("auth", {
  state: () => {
    return initialState;
  },

  actions: {
    async login(user: Login) {
      const service_errors: ApiError[] = [];
      try {
        const { $api } = useNuxtApp();

        const response = await $api.authentication.login(user);
        console.log(response.status.value);
        if (response.data.value != null && response.status.value != "error") {
          await this.loginSuccess(response.data.value);
          return Promise.resolve(response);
        } else if (
          response.status.value == "error" &&
          response.error.value.data
        ) {
          const errors = response.error.value.data as ApiResponseError;
          service_errors.push(...errors.errors);
          this.loginFailure();
        } else {
          service_errors.push({
            code: "General",
            message: "Ha ocurrido algo malo, intentalo de nuevo mas tarde",
          });
          this.loginFailure();
        }
        return Promise.reject(service_errors);
      } catch (error) {
        service_errors.push({
          code: "General",
          message: "Ha ocurrido algo malo, intentalo de nuevo mas tarde",
        });
        this.loginFailure();
        return Promise.reject(service_errors);
      }
    },
    async refreshAccountStatus(
      account: Account | undefined = undefined,
    ): Promise<null | Account> {
      if (account != undefined) {
        this.account = account;
        return this.account;
      }

      try {
        // const response = await AccountService.GetAccountById(
        //   this.user?.token ?? ""
        // );
        // if (!response.success) {
        //   this.account = null;
        //   return null;
        // }
        // this.account = response.data;
        // return response.data;
      } catch (error) {
        console.error(error);
        this.account = null;
        return null;
      }
    },
    async logout() {
      // AuthService.logout();
      this.status.loggedIn = false;
      this.user = null;
      this.account = null;
      const session = useCookie<User>("user");
      session.value = null;
      localStorage.setItem("settings", '{"lang":"es","theme":"dark"}');
    },
    async register(user: NewUser) {
      const { $api } = useNuxtApp();
      return $api.authentication.register({
        email: user.email,
        password: user.password,
        phoneNumber: user.phone,
        userName: user.username,
      });
    },
    async loginSuccess(user: User) {
      this.status.loggedIn = true;
      this.user = user;

      const token = useCookie<User>("user");
      token.value = user;

      await this.refreshAccountStatus();
    },
    loginFailure() {
      this.status.loggedIn = false;
      this.user = null;
      this.account = null;
    },
  },
});
