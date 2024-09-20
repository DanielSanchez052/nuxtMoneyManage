import { type FetchOptions } from "ofetch";
import { type AsyncDataOptions } from "#app";
import FetchFactory from "../factory";
import { type ApiResponseError } from "~/types/api.js";

// Interfaces basadas en los schemas de Swagger
interface UserLogin {
  email: string;
  password: string;
}

interface TokenResponse {
  userId: string;
  accountId: string;
  email: string;
  username: string;
  phone: string;
  token: string;
  expiration: string;
}

interface UserRegister {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface ConfirmUserEmailRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
}

interface ResetPassword {
  email: string;
  password: string;
  resetPasswordToken: string;
}

interface UpdateUser {
  userName: string;
  email: string;
  phoneNumber: string;
}

class AuthenticationModule extends FetchFactory {
  private BASE_URL = "/api";

  login(
    userData: UserLogin,
    asyncDataOptions?: AsyncDataOptions<TokenResponse>,
  ) {
    return useAsyncData(() => {
      return this.call<TokenResponse>(
        "POST",
        `${this.BASE_URL}/security/create-token`,
        JSON.stringify(userData),
      );
    }, asyncDataOptions);
  }

  register(userData: UserRegister, asyncDataOptions?: AsyncDataOptions<void>) {
    return useAsyncData(() => {
      return this.call<void>(
        "POST",
        `${this.BASE_URL}/user`,
        JSON.stringify(userData),
      );
    }, asyncDataOptions);
  }

  confirmEmailRequest(
    email: ConfirmUserEmailRequest,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>(
        "POST",
        `${this.BASE_URL}/user/confirm-email-request`,
        JSON.stringify(email),
      );
    }, asyncDataOptions);
  }

  confirmEmail(
    userId: string,
    token: string,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>(
        "GET",
        `${this.BASE_URL}/user/confirm-email?UserId=${userId}&Token=${token}`,
      );
    }, asyncDataOptions);
  }

  resetPasswordRequest(
    email: ResetPasswordRequest,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>(
        "POST",
        `${this.BASE_URL}/user/reset-password-request`,
        JSON.stringify(email),
      );
    }, asyncDataOptions);
  }

  resetPassword(
    resetData: ResetPassword,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call<void>(
        "PUT",
        `${this.BASE_URL}/user/reset-password`,
        JSON.stringify(resetData),
      );
    }, asyncDataOptions);
  }

  updateUser(
    id: string,
    userData: UpdateUser,
    asyncDataOptions?: AsyncDataOptions<void>,
  ) {
    return useAsyncData(() => {
      return this.call(
        "PUT",
        `${this.BASE_URL}/user/${id}`,
        JSON.stringify(userData),
      );
    }, asyncDataOptions);
  }
}

export default AuthenticationModule;
