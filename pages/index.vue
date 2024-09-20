<template>
    <VaForm ref="form" class="w-full" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">{{ t("auth.login") }}</h1>
        <h2>General: {{ $config.public.generalParam }}</h2>
        <h2>Especific: {{ $config.public.especificParam }}</h2>
        <p class="text-base mb-4 leading-5">
            <NuxtLink to="/auth/signup" class="font-semibold text-primary">
                {{ t("auth.sign_up") }}
            </NuxtLink>
        </p>
        <VaInput
            v-model="formData.email"
            :rules="[validators.required, validators.email]"
            class="mb-4"
            :label="t('auth.email')"
            type="email"
            aria-autocomplete="list"
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
                v-model="formData.password"
                :rules="[validators.required]"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                :label="t('auth.password')"
                @clickAppendInner.stop="
                    isPasswordVisible.value = !isPasswordVisible.value
                "
            >
                <template #appendInner>
                    <VaIcon
                        :name="
                            isPasswordVisible.value
                                ? 'mso-visibility_off'
                                : 'mso-visibility'
                        "
                        class="cursor-pointer"
                        color="secondary"
                    />
                </template>
            </VaInput>
        </VaValue>

        <div
            class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between"
        >
            <NuxtLink
                to="/auth/recover-password"
                class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary"
            >
                {{ t("auth.forgot_password") }}
            </NuxtLink>
        </div>

        <div class="flex justify-center mt-4">
            <VaButton class="w-full" :loading="isLoading" @click="submit">{{
                t("auth.login")
            }}</VaButton>
        </div>
    </VaForm>
</template>

<script setup lang="ts">
import { type Login } from "~/types/auth";
import { type ApiError } from "~/types/api";
import { useForm, useToast } from "vuestic-ui";
import { reactive, ref, onMounted } from "vue";
import { useGlobalStore } from "~/stores/global-store";
import { useAuthStore } from "~/stores/auth-store";

definePageMeta({
    layout: "auth-layout",
});

const globalStore = useGlobalStore();
const authStore = useAuthStore();
const { validate } = useForm("form");
const { init } = useToast();
const { t } = useI18n();
const { push } = useRouter();
const route = useRoute();
const isLoading = ref(false);

const formData = reactive<Login>({
    email: "",
    password: "",
});

onMounted(() => {
    if (authStore.status.loggedIn) {
        push("/dashboard");
    }
});

const { $api } = useNuxtApp();
const config = useRuntimeConfig();

const submit = async () => {
    isLoading.value = true;

    if (validate()) {
        authStore.login(formData).then(
            async () => {
                // await notificationHub.startSignalR(authStore?.user?.token ?? '')

                globalStore.setConfig(authStore.account?.accountSettings);

                // notificationHub.signalOn('accountBalanced', async (message: string) => {
                //   try {
                //     const messageParsed = JSON.parse(message)
                //     await authStore.refreshAccountStatus(objectKeysToCamellCase(messageParsed.Data))
                //   } catch (error) {
                //     await authStore.refreshAccountStatus()
                //   }
                // })

                let redirect_to = route.query.redirectTo?.toString();
                redirect_to = redirect_to?.slice(1, redirect_to.length);

                init({
                    message: "You've successfully logged in",
                    color: "success",
                });

                if (!redirect_to) {
                    console.log("redirect");
                    push("/dashboard");
                    isLoading.value = false;
                    return;
                }

                isLoading.value = false;
                push({ name: redirect_to });
            },
            (e) => {
                const messages = e
                    .flatMap((item: ApiError) => item.message)
                    .join(",");
                init({ message: messages, color: "danger" });
                isLoading.value = false;
            },
        );
    }
};
</script>
