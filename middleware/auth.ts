import { useAuthStore } from "~/stores/auth-store";
import type { User } from "~/types/auth";
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { status, user } = storeToRefs(useAuthStore());
  const session = useCookie<User>("user");

  if (session.value) {
    user.value = session.value;
    status.value.loggedIn = true;
  } else {
    abortNavigation();
    return navigateTo("/");
  }
});
